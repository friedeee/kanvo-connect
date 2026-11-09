<?php

namespace App\Http\Controllers\Seller;

use App\Enums\SellerCraft;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\SellerApplicationRequest;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()->seller) {
            return to_route('seller.dashboard');
        }

        return Inertia::render('seller/apply', [
            'crafts' => collect(SellerCraft::cases())->map(fn (SellerCraft $craft) => [
                'value' => $craft->value,
                'label' => $craft->label(),
            ]),
        ]);
    }

    public function store(SellerApplicationRequest $request): RedirectResponse
    {
        abort_if($request->user()->seller()->exists(), 409, 'Une demande vendeur existe déjà pour ce compte.');

        $seller = $request->user()->seller()->create($request->validated());

        AuditLog::record('seller.applied', $seller);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Votre demande a été envoyée. Elle sera examinée par l’équipe Kanvô.']);

        return to_route('seller.dashboard');
    }
}
