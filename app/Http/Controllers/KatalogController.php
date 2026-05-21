<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KatalogController extends Controller
{
    public function index(Request $request)
    {
        // Ambil semua buku yang udah di-acc admin, beserta relasi kategorinya
        $query = Book::with('categories')->where('is_approved', true);

        // 1. Logika Pencarian (Search)
        if ($request->has('search') && $request->search != '') {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                  ->orWhere('author', 'like', '%' . $searchTerm . '%');
            });
        }

        // 2. Logika Filter Kategori
        if ($request->has('category') && $request->category != 'all') {
            $categorySlug = $request->category;
            $query->whereHas('categories', function($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        $userId = auth()->id();
        $books = $query->latest()->get()->map(function ($book) use ($userId) {
            $book->is_favorited = $userId ? $book->favorites()->where('user_id', $userId)->exists() : false;
            return $book;
        });

        return Inertia::render('Katalog', [
            // Kirim data ke React
            'books' => $books,
            'categories' => Category::withCount('books')->get(),
            'filters' => [
                'search' => $request->search ?? '',
                'category' => $request->category ?? 'all',
            ]
        ]);
    }
}