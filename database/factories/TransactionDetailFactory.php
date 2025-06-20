<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransactionDetail>
 */
class TransactionDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $length_transactions = Transaction::count();
        $length_products = Product::count();
        $price = fake()->numberBetween(5000, 50000);
        $qty = fake()->numberBetween(1, 20);
        $subtotal = $qty * $price;
        return [
            "transaction_id" => mt_rand(1, $length_transactions),
            "product_id" => mt_rand(1, $length_products),
            "price" => $price,
            "qty" => $qty,
            "subtotal" => $subtotal
        ];
    }
}