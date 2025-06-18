<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($search = $request->search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("products/index", [
            "products" => $products,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        return Inertia::render("products/create", [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data_input = $request->validate([
            "category_id" => "required",
            "name" => "required",
            "price" => "required|numeric",
            "stock" => "required|numeric",
        ]);

        Product::create($data_input);

        return redirect()->route("products.index")->with("success", "Product berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::all();
        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $rules = [
            "category_id" => "required",
            "name" => "required",
            "price" => "required|numeric",
            "stock" => "required|numeric",
        ];

        $validate_data = $request->validate($rules);

        $product->update($validate_data);

        return redirect()->route('products.index')->with('success', 'Product berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product Berhasil Dihapus!');
    }
}