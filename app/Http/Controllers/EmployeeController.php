<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        $workers = Employee::paginate(5);
        return Inertia::render('employees/Employee', [
            'data' => [
                'workers' => $workers->items(),
                'total' => $workers->total(),
                'prev_page_url' => $workers->previousPageUrl(),
                'next_page_url' => $workers->nextPageUrl(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        Employee::create($validated);

        return redirect()->back()->with('success', 'Berhasil mendaftarkan worker');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        $worker = Employee::findOrFail($id);
        $worker->update($validated);

        return redirect()->back()->with('success', 'Berhasil memperbarui data worker');
    }

    public function destroy($id)
    {
        $worker = Employee::findOrFail($id);
        $worker->delete();

        return redirect()->back()->with('success', 'Berhasil menghapus worker');
    }
}
