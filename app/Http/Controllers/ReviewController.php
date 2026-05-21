<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Loan;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * User kirim ulasan (hanya untuk loan yang sudah dikembalikan)
     */
    public function store(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loans,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $loan = Loan::where('id', $request->loan_id)
            ->where('user_id', auth()->id())
            ->where('status', 'dikembalikan')
            ->firstOrFail();

        // Cek apakah sudah pernah review loan ini
        $existing = Review::where('loan_id', $loan->id)->first();
        if ($existing) {
            return back()->with('error', 'Kamu sudah pernah memberikan ulasan untuk peminjaman ini.');
        }

        Review::create([
            'user_id' => auth()->id(),
            'book_id' => $loan->book_id,
            'loan_id' => $loan->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Ulasan berhasil dikirim! Terima kasih.');
    }

    /**
     * User update ulasan
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Ulasan berhasil diperbarui.');
    }

    /**
     * User hapus ulasan sendiri
     */
    public function destroy($id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $review->delete();

        return back()->with('success', 'Ulasan berhasil dihapus.');
    }

    /**
     * Admin hapus ulasan (dari dashboard admin)
     */
    public function adminDestroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return back()->with('success', 'Ulasan berhasil dihapus oleh admin.');
    }
}
