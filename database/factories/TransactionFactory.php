<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Customer;
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
        $length_customers = Customer::count();

        return [
            "user_id" => mt_rand(1, $length_users),
            "customer_id" => mt_rand(1, $length_customers),
            "total_price" => fake()->numberBetween(30000, 100000),
            "status" => fake()->randomElement([Transaction::PENDING, Transaction::COMPLETED, Transaction::CANCELLED])
        ];
    }
}