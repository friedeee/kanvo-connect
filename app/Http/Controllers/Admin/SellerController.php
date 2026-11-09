<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SellerStatus;
use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->validate([
            'status' => ['nullable', Rule::enum(SellerStatus::class)],
        ])['status'] ?? SellerStatus::Pending->value;

        $sellers = Seller::with('user:id,name,email')
            ->withCount('products')
            ->where('status', $status)
            ->latest()
            ->paginate(30)
            ->withQueryString()
            ->through(fn (Seller $seller) => [
                'id' => $seller->id,
                'shop_name' => $seller->shop_name,
                'slug' => $seller->slug,
                'craft' => $seller->craft->label(),
                'city' => $seller->city,
                'phone' => $seller->phone,
                'bio' => $seller->bio,
                'status' => $seller->status->value,
                'status_label' => $seller->status->label(),
                'status_reason' => $seller->status_reason,
                'products_count' => $seller->products_count,
                'applied_at' => $seller->created_at?->toIso8601String(),
                'user' => $seller->user->only(['name', 'email']),
            ]);

        return Inertia::render('admin/sellers', [
            'sellers' => $sellers,
            'status' => $status,
            'statuses' => collect(SellerStatus::cases())->map(fn (SellerStatus $s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function approve(Seller $seller): RedirectResponse
    {
        $seller->approve();

        return $this->done("{$seller->shop_name} est validé.");
    }

    public function reject(Request $request, Seller $seller): RedirectResponse
    {
        $seller->reject($this->reason($request));

        return $this->done("La demande de {$seller->shop_name} est refusée.");
    }

    public function suspend(Request $request, Seller $seller): RedirectResponse
    {
        $seller->suspend($this->reason($request));

        return $this->done("{$seller->shop_name} est suspendu. Ses produits ne sont plus visibles.");
    }

    public function reactivate(Seller $seller): RedirectResponse
    {
        $seller->reactivate();

        return $this->done("{$seller->shop_name} est réactivé.");
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
