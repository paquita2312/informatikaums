<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Enums\UserRole;


class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $users = User::select('id', 'name', 'email', 'jabatan', 'role')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->get();

        $roles = ['admin_prodi', 'admin_fakultas', 'pimpinan', 'karyawan'];

        return Inertia::render('User/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }
    public function create(): Response
    {
        $roles = ['admin', 'user', 'manager'];
        return Inertia::render('User/Create', ['roles' => $roles]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'role' => 'required|in:admin_prodi,admin_fakultas,pimpinan,karyawan',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'email' => $validated['email'],
            'name' => $validated['name'],
            'jabatan' => $validated['jabatan'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('user.index')->with('success', 'User berhasil ditambahkan');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'name' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'role' => 'required|in:admin_prodi,admin_fakultas,pimpinan,karyawan',
            'password' => 'nullable|string|min:6',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->jabatan = $validated['jabatan'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('user.index')->with('success', 'User berhasil diperbarui');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('user.index')->with('success', 'User berhasil dihapus');
    }
}
