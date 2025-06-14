<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $base_categories = ["makanan", "minuman"];
        foreach ($base_categories as $category) {
            Category::create([
                "name" => $category
            ]);
        }
    }
}