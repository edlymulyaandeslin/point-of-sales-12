<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Purchase::with(['user', 'supplier', 'purchase_details.product']);

        if ($search = $request->search) {
            $query->where('supplier.name', 'like', "%{$search}%");
        }

        $purchases = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("purchases/index", [
            "purchases" => $purchases,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = Supplier::latest()->get();
        $products = Product::latest()->get();
        return Inertia::render("purchases/create", [
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data_input = $request->validate([
            "supplier_id" => "required",
            "name" => "required",
            "price" => "required|numeric",
            "stock" => "required|numeric",
        ]);

        Purchase::create($data_input);

        return redirect()->route("purchases.index")->with("success", "Pembelian berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        $suppliers = Supplier::all();
        return Inertia::render('purchases/edit', [
            'purchase' => $purchase,
            'suppliers' => $suppliers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase)
    {
        $rules = [
            "category_id" => "required",
            "name" => "required",
            "price" => "required|numeric",
            "stock" => "required|numeric",
        ];

        $validate_data = $request->validate($rules);

        $purchase->update($validate_data);

        return redirect()->route('purchases.index')->with('success', 'Pembelian berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        $purchase->delete();

        return redirect()->route('purchases.index')->with('success', 'Pembelian Berhasil Dihapus!');
    }
}