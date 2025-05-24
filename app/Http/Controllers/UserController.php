<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $totalUsers = User::count();

        return Inertia::render('user/User', [
            'users' => User::select('id', 'name', 'email', 'created_at')->latest()->paginate(5),
            'total' => $totalUsers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required']
        ]);

        User::create($validated);

        return redirect()->back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $user->id],
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'User berhasil diupdate.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }
}
