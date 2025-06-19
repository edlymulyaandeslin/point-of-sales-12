<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    protected $guarded = [];

    // status
    public const PENDING = "pending";
    public const COMPLETED = "completed";
    public const CANCELLED = "cancelled";

    // payment status
    public const CASH = "cash";
    public const QRIS = "qris";

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function transaction_details()
    {
        return $this->hasMany(TransactionDetail::class);
    }
}