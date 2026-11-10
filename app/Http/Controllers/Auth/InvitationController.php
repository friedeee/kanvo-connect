<?php

namespace App\Http\Controllers\Auth;

use App\Concerns\PasswordValidationRules;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use App\Notifications\SellerInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Le vendeur invité par l'admin choisit son mot de passe, puis il est connecté à son espace.
 */
class InvitationController extends Controller
{
    use PasswordValidationRules;

    public function show(Request $request, User $user): Response
    {
        return Inertia::render('auth/accept-invitation', [
            'isValid' => $this->isValid($request, $user),
            'sellerName' => $user->name,
            'hasShop' => $user->seller()->exists(),
            'email' => $user->email,
            'action' => $request->fullUrl(),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }

    public function store(Request $request, User $user): RedirectResponse
    {
        abort_unless($this->isValid($request, $user), 403, 'Ce lien d’invitation n’est plus valable.');

        $validated = $request->validate(['password' => $this->passwordRules()]);

        $user->forceFill([
            'password' => $validated['password'],
            'email_verified_at' => $user->email_verified_at ?? now(),
        ])->save();

        Auth::login($user);
        $request->session()->regenerate();

        if ($user->seller) {
            AuditLog::record('seller.invitation_accepted', $user->seller);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Bienvenue sur Kanvô ! Votre mot de passe est enregistré.']);

        return to_route('dashboard');
    }

    /**
     * Signature correcte, lien non expiré et mot de passe pas encore choisi avec ce lien.
     */
    private function isValid(Request $request, User $user): bool
    {
        return $request->hasValidSignature()
            && hash_equals(SellerInvitation::passwordFingerprint($user), (string) $request->query('hash'));
    }
}
