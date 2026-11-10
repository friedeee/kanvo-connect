<?php

namespace Tests\Feature\Admin;

use App\Enums\SellerStatus;
use App\Models\AuditLog;
use App\Models\Seller;
use App\Models\User;
use App\Notifications\SellerInvitation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SellerAccountTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, string>
     */
    private function payload(array $overrides = []): array
    {
        return [
            'name' => 'Koffi Tchibozo',
            'email' => 'koffi@example.com',
            'shop_name' => 'Atelier Tchibozo',
            'craft' => 'weaver',
            'city' => 'Abomey',
            'phone' => '+229 01 97 00 00 00',
            'bio' => 'Tissage traditionnel à la main sur métier, en coton local, depuis 1998.',
            ...$overrides,
        ];
    }

    public function test_admin_creates_an_approved_seller_and_sends_an_invitation(): void
    {
        Notification::fake();

        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.sellers.store'), $this->payload())
            ->assertRedirect(route('admin.sellers.index', ['status' => 'approved']));

        $user = User::where('email', 'koffi@example.com')->firstOrFail();
        $seller = $user->seller;

        $this->assertSame(SellerStatus::Approved, $seller->status);
        $this->assertNotNull($seller->approved_at);
        $this->assertNull($user->email_verified_at);
        $this->assertTrue(AuditLog::where('action', 'seller.created')->whereMorphedTo('subject', $seller)->exists());
        Notification::assertSentTo($user, SellerInvitation::class);
    }

    public function test_only_admins_can_create_sellers(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.sellers.store'), $this->payload())
            ->assertForbidden();

        $this->assertSame(0, Seller::count());
    }

    public function test_email_must_be_unused(): void
    {
        User::factory()->create(['email' => 'koffi@example.com']);

        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.sellers.store'), $this->payload())
            ->assertSessionHasErrors('email');

        $this->assertSame(0, Seller::count());
    }

    public function test_users_can_no_longer_apply_to_become_sellers(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/vendeur/inscription', $this->payload())
            ->assertNotFound();
    }

    public function test_admin_can_resend_a_pending_invitation(): void
    {
        Notification::fake();
        $seller = Seller::factory()->approved()->for(User::factory()->unverified())->create();

        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.sellers.invitation', $seller))
            ->assertRedirect();

        Notification::assertSentTo($seller->user, SellerInvitation::class);
    }

    public function test_invitation_is_not_resent_once_the_account_is_active(): void
    {
        $seller = Seller::factory()->approved()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.sellers.invitation', $seller))
            ->assertStatus(409);
    }

    public function test_user_without_shop_is_sent_back_to_the_customer_space(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('seller.dashboard'))
            ->assertRedirect(route('dashboard'));
    }

    public function test_pending_seller_cannot_manage_products(): void
    {
        $seller = Seller::factory()->create();

        $this->actingAs($seller->user)->get(route('seller.products.index'))
            ->assertRedirect(route('seller.dashboard'));
    }

    public function test_dashboard_redirects_by_role(): void
    {
        $this->actingAs(User::factory()->admin()->create())->get(route('dashboard'))
            ->assertRedirect(route('admin.dashboard'));

        $this->actingAs(Seller::factory()->create()->user)->get(route('dashboard'))
            ->assertRedirect(route('seller.dashboard'));
    }
}
