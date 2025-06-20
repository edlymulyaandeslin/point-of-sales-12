<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TransactionDetail;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TransactionDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TransactionDetail::factory(15)->create();
    }
}