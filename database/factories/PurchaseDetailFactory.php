<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseDetail>
 */
class PurchaseDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $length_purchases = Purchase::count();
        $length_products = Product::count();
        return [
            "purchase_id" => mt_rand(1, $length_purchases),
            "product_id" => mt_rand(1, $length_products),
            "price" => fake()->numberBetween(2000, 100000),
            "qty" => fake()->numberBetween(50, 200),
            "subtotal" => fake()->numberBetween(50000, 150000)
        ];
    }
}