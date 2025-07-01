<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaporanKeuanganController;
use App\Http\Controllers\TransactionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, "index"])->name('dashboard');

    Route::get('transactions/point-of-sales', [TransactionController::class, "pos"])->name('transactions.pos');
    Route::post('/api/transaction/checkout', [TransactionController::class, "checkout"])->name('transactions.checkout');
});

Route::middleware('is_admin')->group(function () {
    Route::resource("users", UserController::class);
    Route::resource("categories", CategoryController::class);
    Route::resource("products", ProductController::class);
    Route::resource("transactions", TransactionController::class);
    Route::resource("suppliers", SupplierController::class);
    Route::resource("purchases", PurchaseController::class);
    Route::get('/laporan-keuangan', [LaporanKeuanganController::class, "index"])->name('laporan.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';