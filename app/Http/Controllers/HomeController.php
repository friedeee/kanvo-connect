<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Http\Resources\ProductCardResource;
use App\Http\Resources\SellerPublicResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $products = Product::inCatalog()
            ->with(['images', 'category', 'seller'])
            ->latest('published_at')
            ->limit(8)
            ->get();

        $sellers = Seller::approved()
            ->withCount(['products' => fn ($query) => $query->where('status', ProductStatus::Published)])
            ->orderByDesc('products_count')
            ->limit(4)
            ->get();

        return Inertia::render('public/home', [
            'products' => ProductCardResource::collection($products)->resolve(),
            'sellers' => SellerPublicResource::collection($sellers)->resolve(),
            'categories' => Category::orderBy('position')->get(['id', 'name', 'slug']),
        ]);
    }
}
