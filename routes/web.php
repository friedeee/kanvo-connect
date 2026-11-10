<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Auth\InvitationController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Seller;
use App\Http\Controllers\SellerProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('catalogue', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('produits/{product:slug}', [CatalogController::class, 'show'])->name('catalog.show');
Route::get('artisans/{seller:slug}', [SellerProfileController::class, 'show'])->name('sellers.show');

/* Invitation vendeur : lien signé reçu par e-mail pour choisir son mot de passe. */
Route::middleware('guest')->group(function () {
    Route::get('invitation/{user}', [InvitationController::class, 'show'])->name('invitation.show');
    Route::post('invitation/{user}', [InvitationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('invitation.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        return match (true) {
            $request->user()->isAdmin() => to_route('admin.dashboard'),
            $request->user()->seller()->exists() => to_route('seller.dashboard'),
            default => inertia('dashboard'),
        };
    })->name('dashboard');

    Route::prefix('vendeur')->name('seller.')->group(function () {
        Route::get('/', Seller\DashboardController::class)->name('dashboard');

        Route::middleware('seller.approved')->prefix('produits')->name('products.')->group(function () {
            Route::get('/', [Seller\ProductController::class, 'index'])->name('index');
            Route::get('nouveau', [Seller\ProductController::class, 'create'])->name('create');
            Route::post('/', [Seller\ProductController::class, 'store'])->name('store');
            Route::get('{product}', [Seller\ProductController::class, 'edit'])->name('edit');
            Route::put('{product}', [Seller\ProductController::class, 'update'])->name('update');
            Route::patch('{product}/stock', [Seller\ProductController::class, 'updateStock'])->name('stock');
            Route::post('{product}/soumettre', [Seller\ProductController::class, 'submit'])->name('submit');
            Route::post('{product}/desactiver', [Seller\ProductController::class, 'disable'])->name('disable');
        });
    });

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', Admin\DashboardController::class)->name('dashboard');

        Route::get('vendeurs', [Admin\SellerController::class, 'index'])->name('sellers.index');
        Route::get('vendeurs/nouveau', [Admin\SellerController::class, 'create'])->name('sellers.create');
        Route::post('vendeurs', [Admin\SellerController::class, 'store'])->name('sellers.store');
        Route::post('vendeurs/{seller}/invitation', [Admin\SellerController::class, 'resendInvitation'])
            ->middleware('throttle:10,1')
            ->name('sellers.invitation');
        Route::post('vendeurs/{seller}/valider', [Admin\SellerController::class, 'approve'])->name('sellers.approve');
        Route::post('vendeurs/{seller}/refuser', [Admin\SellerController::class, 'reject'])->name('sellers.reject');
        Route::post('vendeurs/{seller}/suspendre', [Admin\SellerController::class, 'suspend'])->name('sellers.suspend');
        Route::post('vendeurs/{seller}/reactiver', [Admin\SellerController::class, 'reactivate'])->name('sellers.reactivate');

        Route::get('produits', [Admin\ProductController::class, 'index'])->name('products.index');
        Route::post('produits/{product}/publier', [Admin\ProductController::class, 'publish'])->name('products.publish');
        Route::post('produits/{product}/refuser', [Admin\ProductController::class, 'reject'])->name('products.reject');
        Route::post('produits/{product}/retirer', [Admin\ProductController::class, 'withdraw'])->name('products.withdraw');

        Route::get('categories', [Admin\CategoryController::class, 'index'])->name('categories.index');
        Route::post('categories', [Admin\CategoryController::class, 'store'])->name('categories.store');
        Route::put('categories/{category}', [Admin\CategoryController::class, 'update'])->name('categories.update');
        Route::delete('categories/{category}', [Admin\CategoryController::class, 'destroy'])->name('categories.destroy');

        Route::get('journal', [Admin\AuditLogController::class, 'index'])->name('audit-log');
    });
});

require __DIR__.'/settings.php';
