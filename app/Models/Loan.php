<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'petugas_id',
        'borrow_date',
        'due_date',
        'return_date',
        'status',
        'is_extended',
        'extended_due_date',
        'notes',
    ];

    /**
     * Relasi: Siapa yang minjem? (User/Member)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi: Buku apa yang dipinjem?
     */
    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    /**
     * Relasi: Siapa petugas yang memproses? (Optional)
     */
    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    /**
     * Relasi: Denda terkait peminjaman ini (One-to-One)
     */
    public function fine()
    {
        return $this->hasOne(Fine::class);
    }
}