<?php

namespace Tests\Feature\Seller;

use App\Enums\SellerStatus;
use App\Models\AuditLog;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SellerApplicationTest extends TestCase
{
    use RefreshDatabase;

    private function payload(): array
    {
        return [
            'shop_name' => 'Atelier Tchibozo',
            'craft' => 'weaver',
            'city' => 'Abomey',
            'phone' => '+229 01 97 00 00 00',
            'bio' => 'Tissage traditionnel à la main sur métier, en coton local, depuis 1998.',
        ];
    }

    public function test_user_can_apply_and_starts_pending(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('seller.apply.store'), $this->payload())
            ->assertRedirect(route('seller.dashboard'));

        $seller = $user->seller()->first();
        $this->assertSame(SellerStatus::Pending, $seller->status);
        $this->assertTrue(AuditLog::where('action', 'seller.applied')->whereMorphedTo('subject', $seller)->exists());
    }

    public function test_user_cannot_apply_twice(): void
    {
        $seller = Seller::factory()->create();

        $this->actingAs($seller->user)->post(route('seller.apply.store'), $this->payload())->assertStatus(409);
        $this->assertSame(1, Seller::count());
    }

    public function test_unverified_user_cannot_apply(): void
    {
        $this->actingAs(User::factory()->unverified()->create())
            ->post(route('seller.apply.store'), $this->payload())
            ->assertRedirect(route('verification.notice'));
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
