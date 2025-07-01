<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Transaction;
use Illuminate\Http\Request;

class LaporanKeuanganController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'transaction_details']);

        if ($search = $request->search) {
            $query->where('customer', 'like', "%{$search}%");
        }

        if ($request->date_from && $request->date_to) {
            $start = Carbon::parse($request->date_from)->startOfDay(); // 00:00:00
            $end = Carbon::parse($request->date_to)->endOfDay();       // 23:59:59.999999

            $query->whereBetween('created_at', [$start, $end]);
        }

        $transactions = $query
            ->where('status', Transaction::COMPLETED)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('laporan-keuangan/index', [
            'transactions' => $transactions,
            "search" => $request->search,
            "date_from" => $request->date_from,
            "date_to" => $request->date_to
        ]);
    }
}