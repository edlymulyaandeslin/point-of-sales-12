<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Initialize role admin and kasir
        $admin = Role::create(["name" => "admin"]);
        $kasir = Role::create(["name" => "kasir"]);

        $admin_user = User::factory()->create([
            "name" => "Edly Mulya Ands",
            "email" => "super@gmail.com",
        ]);
        $kasir_user = User::factory()->create([
            "name" => "Kasir Ands",
            "email" => "kasir@gmail.com",
        ]);

        $admin_user->syncRoles($admin);
        $kasir_user->syncRoles($kasir);

        $this->call([
            CustomerSeeder::class,
            SupplierSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            PurchaseSeeder::class,
            TransactionSeeder::class,
            TransactionDetailSeeder::class,
            PaymentSeeder::class,
        ]);
    }
}