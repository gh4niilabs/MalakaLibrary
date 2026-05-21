<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    // Biar bisa input data lewat form (Mass Assignment)
    protected $fillable = [
        'added_by',
        'title',
        'author',
        'publisher',
        'isbn',
        'year',
        'stock',
        'available',
        'cover',
        'description',
        'is_approved',
    ];

    /**
     * Relasi ke Kategori (Many-to-Many)
     * Menghubungkan lewat tabel pivot 'book_category'
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'book_category');
    }

    /**
     * Relasi ke User (Siapa yang nambahin buku ini)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    /**
     * Relasi ke Tabel Peminjaman (One-to-Many)
     */
    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    /**
     * Relasi ke Favorit (One-to-Many)
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}