<?php

namespace Tests\Feature\Auth;

use App\Models\Seller;
use App\Models\User;
use App\Notifications\SellerInvitation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SellerInvitationTest extends TestCase
{
    use RefreshDatabase;

    private function invitedSeller(): Seller
    {
        return Seller::factory()->approved()->for(User::factory()->unverified())->create();
    }

    public function test_invitation_link_shows_the_password_form(): void
    {
        $seller = $this->invitedSeller();

        $this->get(SellerInvitation::url($seller->user))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/accept-invitation')
                ->where('isValid', true)
                ->where('email', $seller->user->email)
                ->where('sellerName', $seller->user->name));
    }

    public function test_seller_chooses_a_password_and_is_logged_in(): void
    {
        $seller = $this->invitedSeller();

        $this->post(SellerInvitation::url($seller->user), [
            'password' => 'un-mot-de-passe-solide',
            'password_confirmation' => 'un-mot-de-passe-solide',
        ])->assertRedirect(route('dashboard'));

        $this->assertAuthenticatedAs($seller->user);
        $this->assertNotNull($seller->user->fresh()->email_verified_at);
        $this->assertTrue(auth()->attempt(['email' => $seller->user->email, 'password' => 'un-mot-de-passe-solide']));
    }

    public function test_invitation_link_works_only_once(): void
    {
        $seller = $this->invitedSeller();
        $url = SellerInvitation::url($seller->user);
        $password = ['password' => 'un-mot-de-passe-solide', 'password_confirmation' => 'un-mot-de-passe-solide'];

        $this->post($url, $password);
        auth()->logout();

        $this->post($url, $password)->assertForbidden();
        $this->get($url)->assertInertia(fn (Assert $page) => $page->where('isValid', false));
    }

    public function test_expired_or_tampered_links_are_refused(): void
    {
        $seller = $this->invitedSeller();
        $url = SellerInvitation::url($seller->user);

        $this->get($url.'x')->assertInertia(fn (Assert $page) => $page->where('isValid', false));

        $this->travel(SellerInvitation::VALID_DAYS + 1)->days();
        $this->get($url)->assertInertia(fn (Assert $page) => $page->where('isValid', false));
    }
}
