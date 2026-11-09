<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductCardResource;
use App\Http\Resources\ProductDetailResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', Rule::in(array_keys(config('kanvo.colors')))],
            'seller' => ['nullable', 'string', 'max:100'],
            'price_min' => ['nullable', 'integer', 'min:0'],
            'price_max' => ['nullable', 'integer', 'min:0'],
            'min_length_cm' => ['nullable', 'integer', 'min:0'],
            'available' => ['nullable', 'boolean'],
            'sort' => ['nullable', Rule::in(['recent', 'price_asc', 'price_desc'])],
        ]);

        $products = Product::inCatalog()
            ->with(['images', 'category', 'seller'])
            ->when($filters['q'] ?? null, function (Builder $query, string $term) {
                $like = '%'.addcslashes($term, '%_\\').'%';
                $query->where(fn (Builder $q) => $q->whereLike('name', $like)->orWhereLike('description', $like));
            })
            ->when($filters['category'] ?? null, fn (Builder $q, string $slug) => $q->whereRelation('category', 'slug', $slug))
            ->when($filters['seller'] ?? null, fn (Builder $q, string $slug) => $q->whereRelation('seller', 'slug', $slug))
            ->when($filters['color'] ?? null, fn (Builder $q, string $color) => $q->whereJsonContains('colors', $color))
            ->when($filters['price_min'] ?? null, fn (Builder $q, int $min) => $q->where('price_xof', '>=', $min))
            ->when($filters['price_max'] ?? null, fn (Builder $q, int $max) => $q->where('price_xof', '<=', $max))
            ->when($filters['min_length_cm'] ?? null, fn (Builder $q, int $min) => $q->where('length_cm', '>=', $min))
            ->when($request->boolean('available'), fn (Builder $q) => $q->available())
            ->when(
                $filters['sort'] ?? 'recent',
                fn (Builder $q, string $sort) => match ($sort) {
                    'price_asc' => $q->orderBy('price_xof'),
                    'price_desc' => $q->orderByDesc('price_xof'),
                    default => $q->latest('published_at'),
                },
            )
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('public/catalog', [
            'products' => ProductCardResource::collection($products),
            'filters' => (object) $filters,
            'categories' => Category::orderBy('position')->get(['id', 'name', 'slug']),
            'sellers' => Seller::approved()->orderBy('shop_name')->get(['shop_name', 'slug']),
            'colors' => config('kanvo.colors'),
        ]);
    }

    public function show(Request $request, Product $product): Response
    {
        $product->load(['images', 'category', 'seller']);

        // Un produit hors catalogue reste visible en aperçu pour son vendeur et l'administration.
        $isPreview = ! $product->isInCatalog();

        abort_if(
            $isPreview && ! ($request->user()?->isAdmin() || $request->user()?->can('manage', $product)),
            404,
        );

        return Inertia::render('public/product', [
            'product' => (new ProductDetailResource($product))->resolve(),
            'isPreview' => $isPreview,
        ]);
    }
}
