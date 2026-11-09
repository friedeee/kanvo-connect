<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->validate([
            'status' => ['nullable', Rule::enum(ProductStatus::class)],
        ])['status'] ?? ProductStatus::PendingReview->value;

        $products = Product::with(['seller:id,shop_name,slug,status', 'category:id,name', 'images'])
            ->where('status', $status)
            ->latest('updated_at')
            ->paginate(30)
            ->withQueryString()
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price_xof' => $product->price_xof,
                'category' => $product->category->name,
                'status' => $product->status->value,
                'status_label' => $product->status->label(),
                'status_reason' => $product->status_reason,
                'image_url' => $product->images->first()?->url,
                'images_count' => $product->images->count(),
                'seller' => [
                    'shop_name' => $product->seller->shop_name,
                    'is_approved' => $product->seller->isApproved(),
                ],
                'updated_at' => $product->updated_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/products', [
            'products' => $products,
            'status' => $status,
            'statuses' => collect(ProductStatus::cases())->map(fn (ProductStatus $s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function publish(Product $product): RedirectResponse
    {
        $product->publish();

        return $this->done("« {$product->name} » est publié.");
    }

    public function reject(Request $request, Product $product): RedirectResponse
    {
        $product->reject($this->reason($request));

        return $this->done("« {$product->name} » est refusé.");
    }

    public function withdraw(Request $request, Product $product): RedirectResponse
    {
        $product->withdraw($this->reason($request));

        return $this->done("« {$product->name} » est retiré du catalogue.");
    }

    private function reason(Request $request): string
    {
        return $request->validate(['reason' => ['required', 'string', 'min:5', 'max:1000']])['reason'];
    }

    private function done(string $message): RedirectResponse
    {
        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return back();
    }
}
