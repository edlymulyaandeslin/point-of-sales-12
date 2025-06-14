<?php

namespace Database\Factories;

use App\Models\User;
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
        $length_users = User::count();
        $length_suppliers = Supplier::count();
        return [
            "user_id" => mt_rand(1, $length_users),
            "supplier_id" => mt_rand(1, $length_suppliers),
            "total_price" => fake()->numberBetween(100000, 500000)
        ];
    }
}