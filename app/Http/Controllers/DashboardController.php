<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Models\TransactionDetail;

class DashboardController extends Controller
{
    public function index()
    {
        $transaction = Transaction::with('user');

        $new_transaction = $transaction->latest()->paginate(3);

        $startDate = Carbon::now()->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        $total_penjualan = $transaction
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->sum('total_price');

        $jumlah_transaksi_today = $transaction
            ->whereDate('created_at', today())
            ->count();

        $jumlah_barang_terjual = TransactionDetail::whereHas('transaction', function ($query) use ($startDate, $endDate) {
            $query->where('status', 'completed')
                ->whereBetween('created_at', [$startDate, $endDate]);
        })->distinct()
            ->pluck('product_id')
            ->count();

        return Inertia::render('dashboard', [
            'new_transaction' => $new_transaction,
            'total_penjualan' => $total_penjualan,
            'jumlah_transaksi_today' => $jumlah_transaksi_today,
            'jumlah_barang_terjual' => $jumlah_barang_terjual,
        ]);
    }
}