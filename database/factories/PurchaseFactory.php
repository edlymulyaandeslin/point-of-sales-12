<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Purchase>
 */
class PurchaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $length_suppliers = Supplier::count();
        $length_products = Product::count();
        return [
            "supplier_id" => mt_rand(1, $length_suppliers),
            "product_id" => mt_rand(1, $length_products),
            'price' => fake()->numberBetween(1000, 100000),
            'qty' => fake()->numberBetween(1, 100),
            'subtotal' => fake()->numberBetween(50000, 200000),
        ];
    }
}