<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Tampilkan halaman daftar buku favorit user
     */
    public function index()
    {
        $favorites = Favorite::with('book.categories')
            ->where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(function ($fav) {
                $book = $fav->book;
                if ($book) {
                    $book->is_favorited = true; // pasti true karena di halaman favorit
                }
                return $book;
            })
            ->filter(); // hapus kalau bukunya null (sudah dihapus dari db)

        return \Inertia\Inertia::render('Favorit', [
            'books' => $favorites->values()
        ]);
    }

    /**
     * Toggle status favorit buku (add/remove)
     */
    public function toggle(Request $request, $book_id)
    {
        $book = Book::findOrFail($book_id);
        $user_id = auth()->id();

        $favorite = Favorite::where('user_id', $user_id)->where('book_id', $book->id)->first();

        if ($favorite) {
            $favorite->delete();
            $message = 'Buku dihapus dari favorit.';
            $is_favorited = false;
        } else {
            Favorite::create([  
                'user_id' => $user_id,
                'book_id' => $book->id,
            ]);
            $message = 'Buku ditambahkan ke favorit.';
            $is_favorited = true;
        }

        // Return json untuk request dari axios/fetch, atau redirect back untuk inertia
        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => $message,
                'is_favorited' => $is_favorited
            ]);
        }

        return back()->with('success', $message);
    }
}
