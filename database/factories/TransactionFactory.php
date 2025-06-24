<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Support\Str;
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
        $money = fake()->numberBetween(30000, 100000);
        return [
            "user_id" => mt_rand(1, $length_users),
            "kode_transaksi" => 'TRX-' . now()->format('YmdHis') . strtoupper(Str::random(4)),
            "customer" => fake()->firstName() . ' ' . fake()->lastName(),
            "money_given" => $money,
            "total_price" => $money,
            "payment_method" => fake()->randomElement([Transaction::CASH, Transaction::QRIS]),
            "status" => fake()->randomElement([Transaction::PENDING, Transaction::COMPLETED, Transaction::CANCELLED]),
        ];
    }
}