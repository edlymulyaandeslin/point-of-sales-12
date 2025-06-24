<?php

namespace App\Http\Controllers;

use Error;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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

        return redirect()->route("transactions.index")->with("success", "Transaksi berhasil ditambahkan.");
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

        return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $transaction->load('transaction_details');

        foreach ($transaction->transaction_details as $td) {
            $product = Product::find($td->product_id);
            $product->stock += $td->qty;
            $product->save();
        }

        $transaction->delete();

        return back()->with('success', 'Transaksi Berhasil Dihapus!');
    }

    public function pos()
    {
        $products = Product::with('category')->latest()->get();
        $categories = Category::latest()->get();
        $paymentMethods = [Transaction::CASH, Transaction::QRIS];

        return Inertia::render('transactions/pos', [
            'products' => $products,
            'categories' => $categories,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function checkout(Request $request)
    {
        DB::beginTransaction();
        try {
            $customer = $request->customer;
            $money_given = $request->money_given;
            $payment_method = $request->payment_method;
            $carts = $request->carts;
            $total_price = 0;

            $transaction = Transaction::create([
                'user_id' => Auth::user()->id,
                'kode_transaksi' => 'TRX-' . now()->format('YmdHis') . strtoupper(Str::random(4)),
                'customer' => $customer,
                'money_given' => $money_given,
                'total_price' => $total_price,
                'payment_method' => $payment_method,
                'status' => Transaction::COMPLETED
            ]);

            foreach ($carts as $cart) {
                $productId = $cart['id'];
                $price = $cart['price'];
                $quantity = $cart['quantity'];
                $subtotal = $price * $quantity;

                $transaction->transaction_details()->create([
                    'product_id' => $productId,
                    'price' => $price,
                    'qty' => $quantity,
                    'subtotal' => $subtotal
                ]);

                $product = Product::find($productId);

                if ($product->stock < $quantity) {
                    throw new \Exception("Stok produk {$product->name} tidak mencukupi. {$product->stock} tersisa");
                }

                $product->stock -= $quantity;
                $product->save();

                $total_price += $subtotal;
            }

            $transaction->total_price = $total_price;
            $transaction->save();

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}