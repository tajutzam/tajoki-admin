<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Employee;
use App\Models\Transaction;
use App\Models\TransactionProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    //


    public function index()
    {

        // Ambil semua transaksi dengan relasi customer dan employee
        $transactions = Transaction::with(['customer', 'employee'])->get();

        $customers = Customer::select('id', 'name')->get();
        $employees = Employee::select('id', 'name')->get();

        return Inertia::render('transactions/Index', [
            'transactions' => $transactions,
            'customers' => $customers,
            'employees' => $employees,
        ]);
    }


    public function create()
    {

        $customers = Customer::select('id', 'name')->get();
        $employees = Employee::select('id', 'name')->get();
        return Inertia::render('transactions/Create', [
            'customers' => $customers,
            'employees' => $employees
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'customer_id' => 'required|exists:customers,id',
            'deadline' => 'required|date',
            'price' => 'required|numeric|min:0',
            'employee_id' => 'required|exists:employees,id',
            'status' => 'required|in:dp,lunas',
            'method_payments' => 'required|string|max:255',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);


        if ($request->hasFile('payment_proof')) {
            $validated['payment_proof'] = $request->file('payment_proof')->store('payment_proofs', 'public');
        }

        $transaction = Transaction::create($validated);

        TransactionProgress::create(
            [
                'title' => 'Pembuatan Project',
                'description' => 'Tahap Awal Project Dibuat',
                'status' => 'done',
                'transaction_id' => $transaction->id
            ]
        );

        return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil dibuat.');


    }


}
