<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $length_transactions = Transaction::count();

        return [
            "transaction_id" => mt_rand(1, $length_transactions),
            "method" => fake()->randomElement([Payment::CASH, Payment::QRIS]),
            "amount" => fake()->numberBetween(100000, 200000)
        ];
    }
}