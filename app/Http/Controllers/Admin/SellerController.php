<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SellerCraft;
use App\Enums\SellerStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSellerRequest;
use App\Models\AuditLog;
use App\Models\Seller;
use App\Models\User;
use App\Notifications\SellerInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->validate([
            'status' => ['nullable', Rule::enum(SellerStatus::class)],
        ])['status'] ?? SellerStatus::Approved->value;

        $sellers = Seller::with('user:id,name,email,email_verified_at')
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
                'invitation_pending' => $seller->user->email_verified_at === null,
            ]);

        return Inertia::render('admin/sellers', [
            'sellers' => $sellers,
            'status' => $status,
            'statuses' => collect(SellerStatus::cases())->map(fn (SellerStatus $s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/sellers/create', [
            'crafts' => collect(SellerCraft::cases())->map(fn (SellerCraft $craft) => [
                'value' => $craft->value,
                'label' => $craft->label(),
            ]),
        ]);
    }

    /**
     * L'admin crée le compte et la boutique (directement validée) ; le vendeur reçoit
     * un e-mail pour choisir son mot de passe. Seul l'admin peut créer des comptes vendeurs.
     */
    public function store(StoreSellerRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $seller = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Str::password(40),
            ]);

            $seller = $user->seller()->create(Arr::except($data, ['name', 'email']));
            $seller->forceFill(['status' => SellerStatus::Approved, 'approved_at' => now()])->save();

            AuditLog::record('seller.created', $seller);

            return $seller;
        });

        $seller->user->notify(new SellerInvitation($seller->shop_name));

        Inertia::flash('toast', ['type' => 'success', 'message' => "La boutique {$seller->shop_name} est créée. Une invitation a été envoyée à {$seller->user->email}."]);

        return to_route('admin.sellers.index', ['status' => SellerStatus::Approved->value]);
    }

    public function resendInvitation(Seller $seller): RedirectResponse
    {
        abort_if($seller->user->email_verified_at !== null, 409, 'Ce vendeur a déjà activé son compte.');

        $seller->user->notify(new SellerInvitation($seller->shop_name));

        return $this->done("Nouvelle invitation envoyée à {$seller->user->email}.");
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
