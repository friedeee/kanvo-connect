<?php

namespace Database\Factories;

use App\Enums\SellerCraft;
use App\Enums\SellerStatus;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Seller>
 */
class SellerFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'shop_name' => 'Atelier '.fake()->lastName(),
            'craft' => fake()->randomElement(SellerCraft::cases()),
            'city' => fake()->randomElement(['Cotonou', 'Porto-Novo', 'Abomey', 'Parakou', 'Ouidah']),
            'phone' => '+229 01 '.fake()->numerify('## ## ## ##'),
            'bio' => fake()->paragraph(),
            'status' => SellerStatus::Pending,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'status' => SellerStatus::Approved,
            'approved_at' => now(),
        ]);
    }

    public function suspended(): static
    {
        return $this->state(fn () => [
            'status' => SellerStatus::Suspended,
            'status_reason' => 'Suspension de test.',
        ]);
    }
}
