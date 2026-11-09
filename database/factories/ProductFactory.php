<?php

namespace Database\Factories;

use App\Enums\ProductStatus;
use App\Enums\SaleUnit;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'seller_id' => Seller::factory()->approved(),
            'category_id' => Category::factory(),
            'name' => 'Pagne '.fake()->word().' '.fake()->word(),
            'description' => fake()->paragraph(),
            'price_xof' => fake()->numberBetween(5, 60) * 1000,
            'sale_unit' => SaleUnit::Pagne,
            'stock_quantity' => fake()->numberBetween(1, 10),
            'lead_time_days' => null,
            'length_cm' => 200,
            'width_cm' => 120,
            'colors' => fake()->randomElements(array_keys(config('kanvo.colors')), 2),
            'materials' => 'Coton',
            'care_instructions' => 'Lavage à la main, à l’eau froide.',
            'status' => ProductStatus::Draft,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => ProductStatus::Published,
            'published_at' => now(),
        ]);
    }

    public function pendingReview(): static
    {
        return $this->state(fn () => ['status' => ProductStatus::PendingReview]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => ['stock_quantity' => 0, 'lead_time_days' => null]);
    }
}
