<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::paginate(5);
        return Inertia::render('customers/Customer', [
            'data' => [
                'customers' => $customers->items(),
                'total' => $customers->total(),
                'prev_page_url' => $customers->previousPageUrl(),
                'next_page_url' => $customers->nextPageUrl(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        Customer::create($validated);

        return redirect()->back()->with('success', 'Berhasil mendaftarkan customer');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        $customer = Customer::findOrFail($id);
        $customer->update($validated);

        return redirect()->back()->with('success', 'Berhasil memperbarui data customer');
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return redirect()->back()->with('success', 'Berhasil menghapus customer');
    }
}
