<?php

namespace App\Http\Controllers;

use App\Models\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CategoryServiceController extends Controller
{
    // Tampilkan halaman index dengan data paginasi
    public function index()
    {
        $categoryServices = CategoryService::orderBy('created_at', 'desc')->paginate(10);
        $total = CategoryService::count();

        return Inertia::render('category_services/CategoryService', [
            'categoryServices' => $categoryServices,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:category_services,name',
            'description' => 'nullable|string',
            'start_from' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // validasi image
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('category_services', 'public');
            $validated['image'] = $path;
        }

        CategoryService::create($validated);

        return redirect()->route('category-services.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $categoryService = CategoryService::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('category_services')->ignore($categoryService->id)],
            'description' => 'nullable|string',
            'start_from' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($categoryService->image && Storage::disk('public')->exists($categoryService->image)) {
                Storage::disk('public')->delete($categoryService->image);
            }

            $path = $request->file('image')->store('category_services', 'public');
            $validated['image'] = $path;
        }

        $categoryService->update($validated);

        return redirect()->route('category-services.index')->with('success', 'Kategori berhasil diperbarui.');
    }


    public function destroy($id)
    {
        $categoryService = CategoryService::findOrFail($id);
        $categoryService->delete();

        return redirect()->route('category-services.index')->with('success', 'Kategori berhasil dihapus.');
    }
}
