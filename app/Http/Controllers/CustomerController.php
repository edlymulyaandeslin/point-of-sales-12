<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($search = $request->search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $customers = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("customers/index", [
            "customers" => $customers,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("customers/create");
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

        Customer::create($data_input);

        return redirect()->route("customers.index")->with("success", "Customer berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        return Inertia::render('customers/edit', [
            'customer' => $customer
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $rules = [
            'name' => 'max:20',
            'phone' => 'numeric|max_digits:13',
        ];

        $validate_data = $request->validate($rules);

        if (!$request->name) {
            $validate_data['name'] = $customer->name;
        }
        if (!$request->phone) {
            $validate_data['phone'] = $customer->phone;
        }

        $customer->update($validate_data);

        return redirect()->route('customers.index')->with('success', 'Customer berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')->with('success', 'Customer Berhasil Dihapus!');
    }
}