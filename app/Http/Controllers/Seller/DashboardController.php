<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $seller = $request->user()->seller;

        if (! $seller) {
            return to_route('seller.apply');
        }

        $counts = $seller->products()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('seller/dashboard', [
            'seller' => [
                'shop_name' => $seller->shop_name,
                'slug' => $seller->slug,
                'status' => $seller->status->value,
                'status_label' => $seller->status->label(),
                'status_reason' => $seller->status_reason,
            ],
            'productCounts' => $counts,
        ]);
    }
}
