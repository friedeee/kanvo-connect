<?php

namespace Tests\Feature\Seller;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SellerProductTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    private function photo(): UploadedFile
    {
        return UploadedFile::fake()->create('pagne.jpg', 200, 'image/jpeg');
    }

    private function payload(array $overrides = []): array
    {
        return [
            'category_id' => Category::factory()->create()->id,
            'name' => 'Pagne kanvô indigo',
            'description' => 'Pagne tissé à la main, bandes assemblées, motif à rayures.',
            'price_xof' => 35000,
            'sale_unit' => 'pagne',
            'stock_quantity' => 3,
            'length_cm' => 200,
            'width_cm' => 120,
            'colors' => ['indigo', 'blanc'],
            ...$overrides,
        ];
    }

    public function test_approved_seller_creates_a_draft_with_photos(): void
    {
        $seller = Seller::factory()->approved()->create();

        $this->actingAs($seller->user)
            ->post(route('seller.products.store'), $this->payload(['images' => [$this->photo(), $this->photo()]]))
            ->assertRedirect();

        $product = $seller->products()->sole();
        $this->assertSame(ProductStatus::Draft, $product->status);
        $this->assertSame(['indigo', 'blanc'], $product->colors);
        $this->assertCount(2, $product->images);
        Storage::disk('public')->assertExists($product->images->first()->path);
    }

    public function test_product_input_is_validated(): void
    {
        $seller = Seller::factory()->approved()->create();

        $this->actingAs($seller->user)
            ->post(route('seller.products.store'), $this->payload([
                'price_xof' => 12.5,
                'stock_quantity' => -1,
                'colors' => ['fuchsia-fluo'],
                'images' => [UploadedFile::fake()->create('virus.exe', 10, 'application/x-msdownload')],
            ]))
            ->assertSessionHasErrors(['price_xof', 'stock_quantity', 'colors.0', 'images.0']);
    }

    public function test_submit_requires_a_photo_then_waits_for_review(): void
    {
        $product = Product::factory()->create();
        $user = $product->seller->user;

        $this->actingAs($user)->post(route('seller.products.submit', $product))->assertSessionHasErrors('images');
        $this->assertSame(ProductStatus::Draft, $product->fresh()->status);

        $product->images()->create(['path' => 'products/x.jpg', 'position' => 1]);

        $this->actingAs($user)->post(route('seller.products.submit', $product))->assertSessionHasNoErrors();
        $this->assertSame(ProductStatus::PendingReview, $product->fresh()->status);
    }

    public function test_seller_cannot_touch_another_sellers_product(): void
    {
        $product = Product::factory()->create();
        $intruder = Seller::factory()->approved()->create()->user;

        $this->actingAs($intruder)->get(route('seller.products.edit', $product))->assertForbidden();
        $this->actingAs($intruder)->put(route('seller.products.update', $product), $this->payload())->assertForbidden();
        $this->actingAs($intruder)->patch(route('seller.products.stock', $product), ['stock_quantity' => 0])->assertForbidden();
        $this->actingAs($intruder)->post(route('seller.products.submit', $product))->assertForbidden();
        $this->actingAs($intruder)->post(route('seller.products.disable', $product))->assertForbidden();
    }

    public function test_seller_product_list_only_contains_own_products(): void
    {
        $seller = Seller::factory()->approved()->create();
        Product::factory()->for($seller)->create();
        Product::factory()->create();

        $this->actingAs($seller->user)->get(route('seller.products.index'))
            ->assertInertia(fn ($page) => $page->has('products', 1));
    }

    public function test_editing_published_content_sends_it_back_to_review(): void
    {
        $product = Product::factory()->published()->create();

        $this->actingAs($product->seller->user)
            ->put(route('seller.products.update', $product), $this->payload([
                'category_id' => $product->category_id,
                'name' => 'Nouveau nom',
            ]))
            ->assertSessionHasNoErrors();

        $this->assertSame(ProductStatus::PendingReview, $product->fresh()->status);
    }

    public function test_stock_update_keeps_product_published(): void
    {
        $product = Product::factory()->published()->create(['stock_quantity' => 5]);

        $this->actingAs($product->seller->user)
            ->patch(route('seller.products.stock', $product), ['stock_quantity' => 0])
            ->assertSessionHasNoErrors();

        $product->refresh();
        $this->assertSame(ProductStatus::Published, $product->status);
        $this->assertFalse($product->isAvailable());
    }

    public function test_seller_can_disable_a_published_product(): void
    {
        $product = Product::factory()->published()->create();

        $this->actingAs($product->seller->user)->post(route('seller.products.disable', $product));

        $this->assertSame(ProductStatus::Disabled, $product->fresh()->status);
    }

    public function test_photo_limit_is_enforced(): void
    {
        $seller = Seller::factory()->approved()->create();
        $photos = array_map(fn () => $this->photo(), range(1, config('kanvo.max_product_images') + 1));

        $this->actingAs($seller->user)
            ->post(route('seller.products.store'), $this->payload(['images' => $photos]))
            ->assertSessionHasErrors('images');
    }

    public function test_database_refuses_negative_stock(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 1]);

        $this->expectException(QueryException::class);

        Product::whereKey($product->id)->decrement('stock_quantity', 2);
    }
}
