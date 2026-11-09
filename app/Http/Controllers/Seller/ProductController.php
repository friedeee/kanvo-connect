<?php

namespace App\Http\Controllers\Seller;

use App\Enums\SaleUnit;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = $request->user()->seller->products()
            ->with('images')
            ->latest()
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price_xof' => $product->price_xof,
                'stock_quantity' => $product->stock_quantity,
                'lead_time_days' => $product->lead_time_days,
                'status' => $product->status->value,
                'status_label' => $product->status->label(),
                'status_reason' => $product->status_reason,
                'image_url' => $product->images->first()?->url,
            ]);

        return Inertia::render('seller/products/index', ['products' => $products]);
    }

    public function create(): Response
    {
        return Inertia::render('seller/products/form', [
            ...$this->formOptions(),
            'product' => null,
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        $product = DB::transaction(function () use ($request) {
            $product = $request->user()->seller->products()->create($request->productAttributes());
            $this->storeImages($product, $request->validated('images', []));

            return $product;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produit enregistré en brouillon.']);

        return to_route('seller.products.edit', $product);
    }

    public function edit(Product $product): Response
    {
        Gate::authorize('manage', $product);

        return Inertia::render('seller/products/form', [
            ...$this->formOptions(),
            'product' => [
                ...$product->only([
                    'id', 'slug', 'category_id', 'name', 'description', 'price_xof', 'stock_quantity',
                    'lead_time_days', 'length_cm', 'width_cm', 'colors', 'materials', 'care_instructions',
                    'status_reason',
                ]),
                'sale_unit' => $product->sale_unit->value,
                'status' => $product->status->value,
                'status_label' => $product->status->label(),
                'can_submit' => $product->status->canBeSubmitted(),
                'images' => $product->images->map(fn ($image) => ['id' => $image->id, 'url' => $image->url]),
            ],
        ]);
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        Gate::authorize('manage', $product);

        $removedPaths = DB::transaction(function () use ($request, $product) {
            $product->fill($request->productAttributes());
            $contentChanged = $product->isDirty(ProductRequest::CONTENT_FIELDS);
            $product->save();

            $removed = $product->images()->whereIn('id', $request->validated('remove_image_ids', []))->get();
            $product->images()->whereKey($removed->modelKeys())->delete();

            $uploads = $request->validated('images', []);
            $this->storeImages($product, $uploads);

            if ($contentChanged || $removed->isNotEmpty() || $uploads !== []) {
                $product->returnToReviewAfterEdit();
            }

            return $removed->pluck('path')->all();
        });

        // Fichiers supprimés seulement une fois la transaction validée.
        Storage::disk('public')->delete($removedPaths);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produit mis à jour.']);

        return back();
    }

    /**
     * Mise à jour du stock seule : elle ne renvoie pas le produit en validation.
     */
    public function updateStock(Request $request, Product $product): RedirectResponse
    {
        Gate::authorize('manage', $product);

        $product->update($request->validate([
            'stock_quantity' => ['required', 'integer', 'min:0', 'max:100000'],
            'lead_time_days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ]));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Disponibilité mise à jour.']);

        return back();
    }

    public function submit(Product $product): RedirectResponse
    {
        Gate::authorize('manage', $product);

        if (! $product->images()->exists()) {
            throw ValidationException::withMessages([
                'images' => 'Ajoutez au moins une photo avant de soumettre le produit.',
            ]);
        }

        $product->submitForReview();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produit soumis à validation.']);

        return back();
    }

    public function disable(Product $product): RedirectResponse
    {
        Gate::authorize('manage', $product);

        $product->disable();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produit désactivé.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'categories' => Category::orderBy('position')->get(['id', 'name']),
            'colors' => config('kanvo.colors'),
            'saleUnits' => collect(SaleUnit::cases())->map(fn (SaleUnit $unit) => [
                'value' => $unit->value,
                'label' => $unit->label(),
            ]),
            'maxImages' => config('kanvo.max_product_images'),
        ];
    }

    /**
     * @param  array<int, UploadedFile>  $files
     */
    private function storeImages(Product $product, array $files): void
    {
        $position = (int) $product->images()->max('position');

        foreach ($files as $file) {
            $product->images()->create([
                'path' => $file->store("products/{$product->id}", 'public'),
                'position' => ++$position,
            ]);
        }
    }
}
