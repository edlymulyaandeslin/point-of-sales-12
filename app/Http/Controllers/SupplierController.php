<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Supplier::query();

        if ($search = $request->search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $suppliers = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("suppliers/index", [
            "suppliers" => $suppliers,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("suppliers/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data_input = $request->validate([
            "name" => "required",
            "phone" => "required|numeric|max_digits:13",
        ]);

        Supplier::create($data_input);

        return redirect()->route("suppliers.index")->with("success", "Supplier berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $Supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        return Inertia::render('suppliers/edit', [
            'supplier' => $supplier
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $rules = [
            'name' => 'max:20',
            'phone' => 'numeric|max_digits:13',
        ];

        $validate_data = $request->validate($rules);

        if (!$request->name) {
            $validate_data['name'] = $supplier->name;
        }
        if (!$request->phone) {
            $validate_data['phone'] = $supplier->phone;
        }

        $supplier->update($validate_data);

        return redirect()->route('suppliers.index')->with('success', 'Supplier berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->route('suppliers.index')->with('success', 'Supplier Berhasil Dihapus!');
    }
}