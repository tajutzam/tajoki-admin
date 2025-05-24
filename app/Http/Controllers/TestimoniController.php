<?php

namespace App\Http\Controllers;

use App\Models\Testimoni;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class TestimoniController extends Controller
{
    // Menampilkan daftar testimoni dengan pagination
    public function index()
    {
        return Inertia::render(
            'testimonies/Testimonie',
            [
                'testimonies' => Testimoni::orderBy('created_at', 'desc')->paginate(5),
                'total' => Testimoni::count()
            ]
        );
    }

    // Menyimpan testimoni baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'description' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        Testimoni::create($validated);

        return redirect()->back()->with('success', 'Testimoni berhasil ditambahkan');
    }

    // Menampilkan data testimoni untuk edit (opsional, biasanya sudah ada di index dengan Inertia)
    public function edit(Testimoni $testimoni)
    {
        return Inertia::render('testimonies/EditTestimonie', [
            'testimoni' => $testimoni,
        ]);
    }

    // Update testimoni
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'description' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $testimoni = Testimoni::findOrFail($id);

        $testimoni->update($validated);

        return redirect()->back()->with('success', 'Testimoni berhasil diperbarui');
    }

    public function destroy($id)
    {

        $testimoni = Testimoni::findOrFail($id);

        $testimoni->delete();


        return redirect()->back()->with('success', 'Testimoni berhasil dihapus');
    }
}
