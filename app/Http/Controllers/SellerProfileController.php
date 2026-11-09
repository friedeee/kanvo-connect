<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductCardResource;
use App\Http\Resources\SellerPublicResource;
use App\Models\Product;
use App\Models\Seller;
use Inertia\Inertia;
use Inertia\Response;

class SellerProfileController extends Controller
{
    public function show(Seller $seller): Response
    {
        abort_unless($seller->isApproved(), 404);

        $products = Product::inCatalog()
            ->whereBelongsTo($seller)
            ->with(['images', 'category', 'seller'])
            ->latest('published_at')
            ->paginate(24);

        return Inertia::render('public/seller', [
            'seller' => (new SellerPublicResource($seller))->resolve(),
            'products' => ProductCardResource::collection($products),
        ]);
    }
}
