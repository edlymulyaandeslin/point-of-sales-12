<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
 */
class InventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $length_products = Product::count();
        return [
            "product_id" => mt_rand(1, $length_products),
            "type" => fake()->randomElement([Inventory::TYPE_IN, Inventory::TYPE_OUT]),
            "qty" => fake()->numberBetween(50, 100),
        ];
    }
}