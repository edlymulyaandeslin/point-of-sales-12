<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $length_users = User::count();

        return [
            "user_id" => mt_rand(1, $length_users),
            "customer" => fake()->firstName() . ' ' . fake()->lastName(),
            "total_price" => fake()->numberBetween(30000, 100000),
            "payment_status" => fake()->randomElement([Transaction::CASH, Transaction::QRIS]),
            "status" => fake()->randomElement([Transaction::PENDING, Transaction::COMPLETED, Transaction::CANCELLED]),
        ];
    }
}