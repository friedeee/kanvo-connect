<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProductStatus;
use App\Enums\SellerStatus;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Seller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $sellerCounts = Seller::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');
        $productCounts = Product::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');

        return Inertia::render('admin/dashboard', [
            'sellers' => collect(SellerStatus::cases())->map(fn (SellerStatus $status) => [
                'status' => $status->value,
                'label' => $status->label(),
                'total' => $sellerCounts[$status->value] ?? 0,
            ]),
            'products' => collect(ProductStatus::cases())->map(fn (ProductStatus $status) => [
                'status' => $status->value,
                'label' => $status->label(),
                'total' => $productCounts[$status->value] ?? 0,
            ]),
        ]);
    }
}
