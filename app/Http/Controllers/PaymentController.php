<?php

// app/Http/Controllers/PaymentController.php

namespace App\Http\Controllers;

use App\Models\PaymentProof;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = PaymentProof::latest()->paginate(5);

        return Inertia::render('payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('payment_proofs', 'public');

        PaymentProof::create([
            'description' => $validated['description'],
            'image' => $path,
        ]);

        return redirect()->back()->with('success', 'Bukti pembayaran berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $payment = PaymentProof::findOrFail($id);

        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($payment->image && Storage::disk('public')->exists($payment->image)) {
                Storage::disk('public')->delete($payment->image);
            }

            $path = $request->file('image')->store('payment_proofs', 'public');
            $payment->image = $path;
        }

        $payment->description = $validated['description'];
        $payment->save();

        return redirect()->back()->with('success', 'Bukti pembayaran berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $payment = PaymentProof::findOrFail($id);

        if ($payment->image && Storage::disk('public')->exists($payment->image)) {
            Storage::disk('public')->delete($payment->image);
        }

        $payment->delete();

        return redirect()->back()->with('success', 'Bukti pembayaran berhasil dihapus.');
    }
}
