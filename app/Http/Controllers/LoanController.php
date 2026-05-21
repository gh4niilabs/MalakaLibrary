<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Loan;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    /**
     * Ajukan peminjaman buku.
     * User isi form: book_id + due_date (tanggal pengembalian)
     */
    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'due_date' => 'required|date|after:today',
        ]);

        $book = Book::findOrFail($request->book_id);

        // Cek stok buku
        if ($book->available < 1) {
            return back()->with('error', 'Maaf, stok buku ini sedang habis.');
        }

        // Cek apakah user udah punya pinjaman aktif untuk buku ini
        $existingLoan = Loan::where('user_id', auth()->id())
            ->where('book_id', $book->id)
            ->whereIn('status', ['pending', 'dipinjam', 'menunggu_pengembalian'])
            ->first();

        if ($existingLoan) {
            return back()->with('error', 'Kamu sudah punya pinjaman aktif untuk buku ini. Kembalikan dulu sebelum meminjam lagi.');
        }

        // Kurangi stok buku
        $book->decrement('available');

        $borrowDate = now();

        // Catat ke tabel peminjaman (status pending, menunggu admin approve)
        $loan = Loan::create([
            'user_id' => auth()->id(),
            'book_id' => $book->id,
            'status' => 'pending',
            'borrow_date' => $borrowDate,
            'due_date' => $request->due_date,
        ]);

        return back()->with('success', 'Pengajuan peminjaman berhasil dikirim! Menunggu konfirmasi admin.');
    }

    /**
     * User ajukan pengembalian buku.
     * Status: dipinjam → menunggu_pengembalian
     */
    public function requestReturn(Request $request, $id)
    {
        $loan = Loan::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($loan->status !== 'dipinjam') {
            return back()->with('error', 'Buku ini tidak sedang dalam status dipinjam.');
        }

        $loan->update([
            'status' => 'menunggu_pengembalian',
        ]);

        return back()->with('success', 'Pengajuan pengembalian berhasil dikirim! Menunggu konfirmasi admin.');
    }
}