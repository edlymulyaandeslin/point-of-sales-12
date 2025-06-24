<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Transaction;
use Illuminate\Http\Request;

class LaporanKeuanganController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['user', 'transaction_details'])
            ->where('status', Transaction::COMPLETED)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        return Inertia::render('laporan-keuangan/index', [
            'transactions' => $transactions,
        ]);
    }
}