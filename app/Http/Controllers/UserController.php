<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with("roles");

        if ($search = $request->search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("users/index", [
            "users" => $users,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();
        return Inertia::render("users/create", [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            "name" => "required",
            "email" => "required|email|unique:users,id",
            "password" => "required|min:8",
            "role" => "required"
        ]);

        $role = $request->role;
        $data_input = $request->only(["name", "email", "password"]);

        $user = User::create($data_input);
        $user->syncRoles($role);

        return redirect()->route("users.index")->with("success", "User berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $roles = Role::all();
        $user = User::with('roles')->find($id);

        return Inertia::render("users/edit", [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        $rules = [
            'name' => 'required',
            'email' => 'required|unique:users,id,' . $id,
        ];

        if ($request->password) {
            $rules['password'] = 'required';
        }

        $validate_data = $request->validate($rules);

        if ($request->password) {
            $validate_data['password'] = bcrypt($validate_data['password']);
        }

        $user->update($validate_data);

        if ($request->role) {
            $user->syncRoles($request->role);
        }

        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        $user->delete();

        return redirect()->route("users.index")->with('success', 'User telah dihapus!');
    }
}