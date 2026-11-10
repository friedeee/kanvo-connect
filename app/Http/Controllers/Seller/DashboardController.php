<?php

namespace App\Http\Controllers\Seller;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /** En dessous de ce stock, une pièce publiée est signalée comme « bientôt épuisée ». */
    public const LOW_STOCK = 2;

    public function __invoke(Request $request): Response|RedirectResponse
    {
        $seller = $request->user()->seller;

        if (! $seller) {
            return to_route('dashboard');
        }

        $counts = $seller->products()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $card = fn (Product $product) => [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price_xof' => $product->price_xof,
            'stock_quantity' => $product->stock_quantity,
            'status' => $product->status->value,
            'status_label' => $product->status->label(),
            'status_reason' => $product->status_reason,
            'colors' => $product->colors,
            'image_url' => $product->images->first()?->url,
        ];

        return Inertia::render('seller/dashboard', [
            'seller' => [
                'shop_name' => $seller->shop_name,
                'slug' => $seller->slug,
                'craft' => $seller->craft->label(),
                'city' => $seller->city,
                'status' => $seller->status->value,
                'status_label' => $seller->status->label(),
                'status_reason' => $seller->status_reason,
            ],
            'productCounts' => $counts,
            'stockInCatalog' => (int) $seller->products()->where('status', ProductStatus::Published)->sum('stock_quantity'),
            'recentProducts' => $seller->products()->with('images')->latest()->limit(4)->get()->map($card),
            'toFix' => $seller->products()->with('images')
                ->whereIn('status', [ProductStatus::Rejected, ProductStatus::Draft])
                ->latest()->limit(5)->get()->map($card),
            'lowStock' => $seller->products()->with('images')
                ->where('status', ProductStatus::Published)
                ->whereNull('lead_time_days')
                ->where('stock_quantity', '<=', self::LOW_STOCK)
                ->orderBy('stock_quantity')->limit(5)->get()->map($card),
        ]);
    }
}
