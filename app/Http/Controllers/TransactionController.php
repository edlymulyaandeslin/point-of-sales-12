<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Transaction::with('transaction_details.product');

        if ($search = $request->search) {
            $query->where('customer', 'like', "%{$search}%");
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("transactions/index", [
            "transactions" => $transactions,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::latest()->get();
        return Inertia::render("transactions/create", [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data_input = $request->validate([
            "customer" => "required",
            "total_price" => "required",
            "payment_status" => "required",
            "status" => "required",
        ]);

        Transaction::create($data_input);

        return redirect()->route("transactions.index")->with("success", "Pembelian berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        $products = Product::latest()->get();
        return Inertia::render('transactions/edit', [
            'transaction' => $transaction,
            'products' => $products
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        $validate_data = $request->validate([
            "customer" => "required",
            "total_price" => "required",
            "payment_status" => "required",
            "status" => "required",
        ]);

        $transaction->update($validate_data);

        return redirect()->route('transactions.index')->with('success', 'Pembelian berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return redirect()->route('transactions.index')->with('success', 'Pembelian Berhasil Dihapus!');
    }

    public function pos()
    {
        $products = Product::with('category')->latest()->get();
        $categories = Category::latest()->get();

        return Inertia::render('transactions/pos', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}