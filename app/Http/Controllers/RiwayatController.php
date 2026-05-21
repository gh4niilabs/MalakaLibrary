<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiwayatController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $loans = Loan::with(['book', 'fine'])
            ->where('user_id', $userId)
            ->latest()
            ->get()
            ->map(function ($loan) use ($userId) {
                // Cek apakah user sudah review loan ini
                $review = Review::where('loan_id', $loan->id)->where('user_id', $userId)->first();

                return [
                    'id' => $loan->id,
                    'title' => $loan->book->title ?? 'Buku Dihapus',
                    'author' => $loan->book->author ?? '-',
                    'publisher' => $loan->book->publisher ?? '-',
                    'cover' => $loan->book->cover ?? null,
                    'book_id' => $loan->book_id,
                    'borrowed_at' => $loan->borrow_date ? \Carbon\Carbon::parse($loan->borrow_date)->format('d M Y, H:i') : '-',
                    'due_date' => $loan->due_date ? \Carbon\Carbon::parse($loan->due_date)->format('d M Y') : '-',
                    'return_date' => $loan->return_date ? \Carbon\Carbon::parse($loan->return_date)->format('d M Y, H:i') : null,
                    'status' => $loan->status,
                    'user_name' => auth()->user()->name,
                    'fine' => $loan->fine ? [
                        'days_late' => $loan->fine->days_late,
                        'total' => (int) $loan->fine->total_fine,
                        'status' => $loan->fine->status,
                    ] : null,
                    'review' => $review ? [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                    ] : null,
                ];
            });

        return Inertia::render('Riwayat', [
            'borrowHistory' => $loans,
        ]);
    }
}
