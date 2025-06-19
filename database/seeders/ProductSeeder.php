<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dummy_products = [
            'Teh Botol Sosro',
            'Indomie Goreng',
            'Sabun Lifebuoy',
            'Rinso Deterjen 1kg',
            'Aqua 600ml',
            'Kopi Kapal Api',
            'Susu Bendera Coklat',
            'Minyak Goreng Bimoli',
            'Rokok Surya',
            'Rokok OnBold'
        ];
        foreach ($dummy_products as $product) {
            Product::factory()->create([
                'name' => $product
            ]);
        }
    }
}