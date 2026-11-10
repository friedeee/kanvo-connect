<?php

namespace Tests\Feature\Catalog;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalog_lists_only_published_products_of_approved_sellers(): void
    {
        $visible = Product::factory()->published()->create();
        Product::factory()->pendingReview()->create();
        Product::factory()->create(['status' => ProductStatus::Withdrawn]);
        Product::factory()->published()->for(Seller::factory()->suspended())->create();

        $this->get(route('catalog.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/catalog')
                ->has('products.data', 1)
                ->where('products.data.0.id', $visible->id));
    }

    public function test_catalog_filters_by_category_color_price_length_and_availability(): void
    {
        $category = Category::factory()->create(['slug' => 'pagnes-tisses']);
        $match = Product::factory()->published()->for($category)->create([
            'colors' => ['indigo', 'blanc'], 'price_xof' => 25000, 'length_cm' => 200, 'stock_quantity' => 2,
        ]);
        Product::factory()->published()->for($category)->create(['colors' => ['rouge']]);
        Product::factory()->published()->for($category)->create(['colors' => ['indigo'], 'price_xof' => 90000]);
        Product::factory()->published()->for($category)->create(['colors' => ['indigo'], 'price_xof' => 25000, 'length_cm' => 100]);
        Product::factory()->published()->for($category)->outOfStock()->create(['colors' => ['indigo'], 'price_xof' => 25000]);
        Product::factory()->published()->create(['colors' => ['indigo'], 'price_xof' => 25000]);

        $this->get(route('catalog.index', [
            'category' => 'pagnes-tisses',
            'color' => 'indigo',
            'price_max' => 30000,
            'min_length_cm' => 150,
            'available' => 1,
        ]))->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id));
    }

    public function test_search_is_case_insensitive(): void
    {
        $product = Product::factory()->published()->create(['name' => 'Pagne Kanvô indigo']);
        Product::factory()->published()->create(['name' => 'Écharpe tissée']);

        $this->get(route('catalog.index', ['q' => 'KANVÔ']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('products.data', 1)
                ->where('products.data.0.id', $product->id));
    }

    public function test_made_to_order_products_count_as_available(): void
    {
        Product::factory()->published()->outOfStock()->create(['lead_time_days' => 10]);

        $this->get(route('catalog.index', ['available' => 1]))
            ->assertInertia(fn (Assert $page) => $page
                ->has('products.data', 1)
                ->where('products.data.0.is_available', true));
    }

    public function test_product_page_is_public_when_in_catalog(): void
    {
        $product = Product::factory()->published()->create();

        $this->get(route('catalog.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/product')
                ->where('product.id', $product->id)
                ->where('isPreview', false)
                ->where('product.seller.slug', $product->seller->slug)
                ->missing('product.seller.phone'));
    }

    public function test_product_page_shares_kanvo_whatsapp_number_in_digits_only(): void
    {
        config(['kanvo.whatsapp' => '+229 01 97 93 93 15']);
        $product = Product::factory()->published()->create();

        $this->get(route('catalog.show', $product))
            ->assertInertia(fn (Assert $page) => $page->where('whatsappNumber', '2290197939315'));
    }

    public function test_product_page_has_no_whatsapp_number_when_not_configured(): void
    {
        config(['kanvo.whatsapp' => null]);
        $product = Product::factory()->published()->create();

        $this->get(route('catalog.show', $product))
            ->assertInertia(fn (Assert $page) => $page->where('whatsappNumber', null));
    }

    public function test_unpublished_product_is_hidden_from_public_but_previewable_by_owner_and_admin(): void
    {
        $product = Product::factory()->pendingReview()->create();

        $this->get(route('catalog.show', $product))->assertNotFound();
        $this->actingAs(User::factory()->create())->get(route('catalog.show', $product))->assertNotFound();

        $this->actingAs($product->seller->user)->get(route('catalog.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('isPreview', true));

        $this->actingAs(User::factory()->admin()->create())->get(route('catalog.show', $product))->assertOk();
    }

    public function test_seller_profile_is_public_only_when_approved(): void
    {
        $approved = Seller::factory()->approved()->create();
        Product::factory()->published()->for($approved)->count(2)->create();

        $this->get(route('sellers.show', $approved))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/seller')
                ->has('products.data', 2)
                ->missing('seller.phone'));

        $this->get(route('sellers.show', Seller::factory()->create()))->assertNotFound();
        $this->get(route('sellers.show', Seller::factory()->suspended()->create()))->assertNotFound();
    }

    public function test_home_page_shows_featured_products(): void
    {
        Product::factory()->published()->count(3)->create();

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('public/home')->has('products', 3));
    }
}
