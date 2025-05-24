<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // Tampilkan daftar project
    public function index()
    {
        return Inertia::render('projects/Projects', [
            'projects' => Project::with('category')->paginate(6),
            'total' => Project::count(),
            'categories' => CategoryService::all(['id', 'name'])
        ]);
    }

    // Simpan project baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_poster' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'is_published' => 'required|boolean',
            'price' => 'required',
            'languages' => 'required'
        ]);

        if ($request->hasFile('image_poster')) {
            $path = $request->file('image_poster')->store('projects', 'public');
            $validated['image_poster'] = '/storage/' . $path;
        }

        // Default category_id, sesuaikan dengan kebutuhan
        $validated['category_service_id'] = CategoryService::first()->id ?? 1;

        Project::create($validated);

        return redirect()->back()->with('success', 'Project created successfully.');
    }

    // Update project
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_poster' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'is_published' => 'required|boolean',
            'price' => 'required',
            'languages' => 'required'

        ]);

        if ($request->hasFile('image_poster')) {
            // Delete old image if exists
            if ($project->image_poster) {
                $oldPath = str_replace('/storage/', '', $project->image_poster);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image_poster')->store('projects', 'public');
            $validated['image_poster'] = '/storage/' . $path;
        }

        $project->update($validated);

        return redirect()->back()->with('success', 'Project updated successfully.');
    }

    // Hapus project
    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        if ($project->image_poster) {
            $oldPath = str_replace('/storage/', '', $project->image_poster);
            Storage::disk('public')->delete($oldPath);
        }

        $project->delete();

        return redirect()->back()->with('success', 'Project deleted successfully.');
    }
}
