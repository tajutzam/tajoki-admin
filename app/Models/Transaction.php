<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    //

    protected $guarded = ['id'];


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            $transaction->tr_id = 'TRTAJOKI-' . date('YmdHis');
        });
    }


    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'id');
    }


}
