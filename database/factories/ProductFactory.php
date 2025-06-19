<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $lenght_categories = Category::count();
        return [
            "category_id" => mt_rand(1, $lenght_categories),
            "name" => fake()->name(),
            "price" => fake()->numberBetween(5000, 50000),
            "stock" => fake()->numberBetween(10, 100),
        ];
    }
}