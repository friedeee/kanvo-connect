<?php

namespace Tests\Feature\Admin;

use App\Enums\ProductStatus;
use App\Enums\SellerStatus;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminModerationTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
    }

    public function test_non_admins_cannot_reach_administration(): void
    {
        $seller = Seller::factory()->create();

        foreach ([User::factory()->create(), Seller::factory()->approved()->create()->user] as $user) {
            $this->actingAs($user)->get(route('admin.dashboard'))->assertForbidden();
            $this->actingAs($user)->post(route('admin.sellers.approve', $seller))->assertForbidden();
        }

        $this->assertSame(SellerStatus::Pending, $seller->fresh()->status);
    }

    public function test_admin_pages_render(): void
    {
        foreach (['admin.dashboard', 'admin.sellers.index', 'admin.products.index', 'admin.categories.index', 'admin.audit-log'] as $route) {
            $this->actingAs($this->admin)->get(route($route))->assertOk();
        }
    }

    public function test_seller_approval_is_recorded_in_audit_log(): void
    {
        $seller = Seller::factory()->create();

        $this->actingAs($this->admin)->post(route('admin.sellers.approve', $seller))->assertRedirect();

        $seller->refresh();
        $this->assertSame(SellerStatus::Approved, $seller->status);
        $this->assertNotNull($seller->approved_at);

        $log = AuditLog::where('action', 'seller.approved')->sole();
        $this->assertSame($this->admin->id, $log->actor_id);
        $this->assertEquals(['from' => 'pending', 'to' => 'approved'], $log->properties);
    }

    public function test_reject_and_suspend_require_a_reason(): void
    {
        $pending = Seller::factory()->create();
        $approved = Seller::factory()->approved()->create();

        $this->actingAs($this->admin)->post(route('admin.sellers.reject', $pending))->assertSessionHasErrors('reason');
        $this->actingAs($this->admin)->post(route('admin.sellers.suspend', $approved), ['reason' => 'Plainte client vérifiée.']);

        $this->assertSame(SellerStatus::Pending, $pending->fresh()->status);
        $this->assertSame(SellerStatus::Suspended, $approved->fresh()->status);
        $this->assertSame('Plainte client vérifiée.', $approved->fresh()->status_reason);
    }

    public function test_invalid_transition_is_refused(): void
    {
        $approved = Seller::factory()->approved()->create();

        $this->actingAs($this->admin)
            ->from(route('admin.sellers.index'))
            ->post(route('admin.sellers.approve', $approved))
            ->assertRedirect(route('admin.sellers.index'));

        $this->actingAs($this->admin)
            ->postJson(route('admin.sellers.approve', $approved))
            ->assertStatus(409);
    }

    public function test_suspending_a_seller_hides_their_products_and_reactivation_restores_them(): void
    {
        $product = Product::factory()->published()->create();

        $this->actingAs($this->admin)->post(route('admin.sellers.suspend', $product->seller), ['reason' => 'Vérification en cours.']);
        auth()->logout();
        $this->get(route('catalog.show', $product->slug))->assertNotFound();

        $this->actingAs($this->admin)->post(route('admin.sellers.reactivate', $product->seller));
        auth()->logout();
        $this->get(route('catalog.show', $product->slug))->assertOk();
    }

    public function test_admin_publishes_and_rejects_pending_products(): void
    {
        $toPublish = Product::factory()->pendingReview()->create();
        $toReject = Product::factory()->pendingReview()->create();

        $this->actingAs($this->admin)->post(route('admin.products.publish', $toPublish));
        $this->actingAs($this->admin)->post(route('admin.products.reject', $toReject), ['reason' => 'Photos floues.']);

        $this->assertSame(ProductStatus::Published, $toPublish->fresh()->status);
        $this->assertNotNull($toPublish->fresh()->published_at);
        $this->assertSame(ProductStatus::Rejected, $toReject->fresh()->status);
        $this->assertSame('Photos floues.', $toReject->fresh()->status_reason);
    }

    public function test_admin_withdraws_a_product_from_the_catalog(): void
    {
        $product = Product::factory()->published()->create();

        $this->actingAs($this->admin)
            ->post(route('admin.products.withdraw', $product), ['reason' => 'Provenance non vérifiée.'])
            ->assertRedirect();

        $this->assertSame(ProductStatus::Withdrawn, $product->fresh()->status);
        auth()->logout();
        $this->get(route('catalog.show', $product->slug))->assertNotFound();
        $this->assertTrue(AuditLog::where('action', 'product.withdrawn')->exists());
    }

    public function test_category_management(): void
    {
        $this->actingAs($this->admin)->post(route('admin.categories.store'), ['name' => 'Pagnes tissés'])->assertSessionHasNoErrors();
        $this->actingAs($this->admin)->post(route('admin.categories.store'), ['name' => 'Pagnes  tissés'])->assertSessionHasErrors('name');

        $used = Product::factory()->create()->category;
        $this->actingAs($this->admin)->delete(route('admin.categories.destroy', $used));
        $this->assertModelExists($used);

        $empty = Category::where('slug', 'pagnes-tisses')->sole();
        $this->actingAs($this->admin)->delete(route('admin.categories.destroy', $empty));
        $this->assertModelMissing($empty);
    }
}
