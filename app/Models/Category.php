<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Relasi Many-to-Many ke Buku
     * Menghubungkan lewat tabel pivot 'book_category'
     */
    public function books()
    {
        return $this->belongsToMany(Book::class, 'book_category');
    }
}