<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_id',
        'user_id',
        'days_late',
        'fine_per_day',
        'total_fine',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'fine_per_day' => 'decimal:2',
        'total_fine' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
