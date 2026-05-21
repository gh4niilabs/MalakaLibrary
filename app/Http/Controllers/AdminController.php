<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\Fine;
use App\Models\Loan;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminController extends Controller
{
    // ═══════════════════════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════════════════════

    public function index()
    {
        return Inertia::render('Admin/DashboardAdmin', $this->getDashboardData());
    }

    public function loans(Request $request)
    {
        $data = $this->getDashboardData();
        if ($request->has('status') && $request->status !== 'all') {
            $data['loans'] = $this->formatLoans(
                Loan::with(['user', 'book', 'fine'])->where('status', $request->status)->latest()->get()
            );
        }
        return Inertia::render('Admin/DashboardAdmin', $data);
    }

    private function getDashboardData()
    {
        $stats = [
            'totalBooks' => Book::count(),
            'totalLoans' => Loan::count(),
            'pendingLoans' => Loan::where('status', 'pending')->count(),
            'activeLoans' => Loan::where('status', 'dipinjam')->count(),
            'pendingReturns' => Loan::where('status', 'menunggu_pengembalian')->count(),
            'totalMembers' => User::where('role', 'member')->count(),
            'totalCategories' => Category::count(),
            'totalReviews' => Review::count(),
        ];

        return [
            'stats' => $stats,
            'recentLoans' => $this->formatLoans(Loan::with(['user', 'book', 'fine'])->latest()->take(50)->get()),
            'members' => $this->getMembers(),
            'books' => $this->getBooks(),
            'categories' => $this->getCategories(),
            'staff' => $this->getStaff(),
            'reviews' => $this->getReviews(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════
    // DATA HELPERS
    // ═══════════════════════════════════════════════════════════════

    private function getMembers()
    {
        return User::where('role', 'member')->latest()->get()->map(fn($u) => [
            'id' => $u->id, 'name' => $u->name, 'email' => $u->email,
            'phone' => $u->phone ?? '-', 'address' => $u->address ?? '-',
            'no_anggota' => $u->no_anggota ?? '-', 'created_at' => $u->created_at?->format('d M Y') ?? '-',
            'total_loans' => $u->loans()->count(),
        ]);
    }

    private function getBooks()
    {
        return Book::with('categories')->latest()->get()->map(fn($b) => [
            'id' => $b->id, 'title' => $b->title, 'author' => $b->author,
            'publisher' => $b->publisher, 'isbn' => $b->isbn, 'year' => $b->year,
            'stock' => $b->stock, 'available' => $b->available, 'cover' => $b->cover,
            'description' => $b->description,
            'is_approved' => $b->is_approved,
            'categories' => $b->categories->pluck('name')->join(', '),
            'category_ids' => $b->categories->pluck('id'),
        ]);
    }

    private function getCategories()
    {
        return Category::withCount('books')->latest()->get()->map(fn($c) => [
            'id' => $c->id, 'name' => $c->name, 'books_count' => $c->books_count,
        ]);
    }

    private function getStaff()
    {
        return User::where('role', 'petugas')->latest()->get()->map(fn($u) => [
            'id' => $u->id, 'name' => $u->name, 'email' => $u->email,
            'phone' => $u->phone ?? '-', 'created_at' => $u->created_at?->format('d M Y') ?? '-',
        ]);
    }

    private function getReviews()
    {
        return Review::with(['user', 'book'])->latest()->get()->map(fn($r) => [
            'id' => $r->id, 'user_name' => $r->user->name ?? '-', 'book_title' => $r->book->title ?? '-',
            'rating' => $r->rating, 'comment' => $r->comment,
            'created_at' => $r->created_at?->format('d M Y, H:i') ?? '-',
        ]);
    }

    private function formatLoans($loans)
    {
        return $loans->map(function ($loan) {
            $fine = $loan->fine;
            return [
                'id' => $loan->id,
                'user_name' => $loan->user->name ?? 'User Dihapus',
                'user_email' => $loan->user->email ?? '-',
                'user_phone' => $loan->user->phone ?? '-',
                'user_address' => $loan->user->address ?? '-',
                'book_title' => $loan->book->title ?? 'Buku Dihapus',
                'book_author' => $loan->book->author ?? '-',
                'book_publisher' => $loan->book->publisher ?? '-',
                'book_cover' => $loan->book->cover ?? null,
                'borrow_date' => $loan->borrow_date ? Carbon::parse($loan->borrow_date)->format('d M Y, H:i') : '-',
                'due_date' => $loan->due_date ? Carbon::parse($loan->due_date)->format('d M Y') : '-',
                'return_date' => $loan->return_date ? Carbon::parse($loan->return_date)->format('d M Y, H:i') : '-',
                'status' => $loan->status,
                'fine' => $fine ? ['days_late' => $fine->days_late, 'total' => (int) $fine->total_fine, 'status' => $fine->status] : null,
            ];
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // LOAN ACTIONS
    // ═══════════════════════════════════════════════════════════════

    public function approveLoan($id)
    {
        $loan = Loan::findOrFail($id);
        if ($loan->status !== 'pending') return back()->with('error', 'Hanya pending yang bisa di-approve.');
        $loan->update(['status' => 'dipinjam', 'petugas_id' => auth('admin')->id(), 'borrow_date' => now()]);
        return back()->with('success', 'Peminjaman berhasil di-approve!');
    }

    public function rejectLoan($id)
    {
        $loan = Loan::findOrFail($id);
        if ($loan->status !== 'pending') return back()->with('error', 'Hanya pending yang bisa ditolak.');
        $loan->book->increment('available');
        $loan->update(['status' => 'ditolak', 'petugas_id' => auth('admin')->id()]);
        return back()->with('success', 'Peminjaman ditolak. Stok dikembalikan.');
    }

    public function approveReturn($id)
    {
        $loan = Loan::findOrFail($id);
        if ($loan->status !== 'menunggu_pengembalian') return back()->with('error', 'Hanya pengajuan pengembalian yang bisa di-approve.');

        $loan->book->increment('available');
        $returnDate = now();
        $loan->update(['status' => 'dikembalikan', 'return_date' => $returnDate, 'petugas_id' => auth('admin')->id()]);

        // Hitung denda otomatis
        $fineMessage = '';
        if ($loan->due_date) {
            $dueDate = Carbon::parse($loan->due_date)->endOfDay();
            $daysLate = (int) $returnDate->diffInDays($dueDate, false);
            $daysLate = abs(min($daysLate, 0));
            if ($daysLate > 0) {
                $finePerDay = 1500;
                $totalFine = $daysLate * $finePerDay;
                Fine::create(['loan_id' => $loan->id, 'user_id' => $loan->user_id, 'days_late' => $daysLate, 'fine_per_day' => $finePerDay, 'total_fine' => $totalFine, 'status' => 'unpaid']);
                $fineMessage = " Denda: Rp " . number_format($totalFine, 0, ',', '.') . " ({$daysLate} hari terlambat).";
            }
        }
        return back()->with('success', 'Pengembalian berhasil di-approve!' . $fineMessage);
    }

    public function rejectReturn($id)
    {
        $loan = Loan::findOrFail($id);
        if ($loan->status !== 'menunggu_pengembalian') return back()->with('error', 'Hanya pengajuan pengembalian yang bisa ditolak.');
        $loan->update(['status' => 'dipinjam', 'petugas_id' => auth('admin')->id()]);
        return back()->with('success', 'Pengajuan pengembalian ditolak.');
    }

    // ═══════════════════════════════════════════════════════════════
    // CRUD: KATEGORI (Admin only)
    // ═══════════════════════════════════════════════════════════════

    public function storeCategory(Request $request)
    {
        $request->validate(['name' => 'required|string|max:100|unique:categories,name']);
        Category::create(['name' => $request->name, 'slug' => \Illuminate\Support\Str::slug($request->name)]);
        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, $id)
    {
        $request->validate(['name' => 'required|string|max:100|unique:categories,name,' . $id]);
        Category::findOrFail($id)->update(['name' => $request->name, 'slug' => \Illuminate\Support\Str::slug($request->name)]);
        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroyCategory($id)
    {
        Category::findOrFail($id)->delete();
        return back()->with('success', 'Kategori berhasil dihapus.');
    }

    // ═══════════════════════════════════════════════════════════════
    // CRUD: BUKU (Admin + Petugas)
    // ═══════════════════════════════════════════════════════════════

    public function storeBook(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:20',
            'year' => 'nullable|integer',
            'stock' => 'required|integer|min:1',
            'description' => 'nullable|string|max:2000',
            'category_ids' => 'nullable|array',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $isAdmin = auth('admin')->user()->role === 'admin';
        $coverPath = null;
        if ($request->hasFile('cover')) {
            $coverPath = '/storage/' . $request->file('cover')->store('covers', 'public');
        }

        $book = Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'publisher' => $request->publisher,
            'isbn' => $request->isbn,
            'year' => $request->year,
            'stock' => $request->stock,
            'available' => $request->stock,
            'description' => $request->description,
            'cover' => $coverPath,
            'added_by' => auth('admin')->id(),
            'is_approved' => $isAdmin,
        ]);

        if ($request->category_ids) {
            $book->categories()->sync($request->category_ids);
        }

        $msg = $isAdmin ? 'Buku berhasil ditambahkan.' : 'Buku berhasil diajukan. Menunggu validasi admin.';
        return back()->with('success', $msg);
    }

    public function updateBook(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:20',
            'year' => 'nullable|integer',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string|max:2000',
            'category_ids' => 'nullable|array',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $book = Book::findOrFail($id);
        $diff = $request->stock - $book->stock;

        $updateData = [
            'title' => $request->title, 'author' => $request->author,
            'publisher' => $request->publisher, 'isbn' => $request->isbn,
            'year' => $request->year, 'stock' => $request->stock,
            'description' => $request->description,
            'available' => max(0, $book->available + $diff),
        ];

        if ($request->hasFile('cover')) {
            // Hapus cover lama jika ada
            if ($book->cover && Storage::disk('public')->exists(str_replace('/storage/', '', $book->cover))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $book->cover));
            }
            $updateData['cover'] = '/storage/' . $request->file('cover')->store('covers', 'public');
        }

        $book->update($updateData);

        if ($request->has('category_ids')) {
            $book->categories()->sync($request->category_ids);
        }

        return back()->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroyBook($id)
    {
        Book::findOrFail($id)->delete();
        return back()->with('success', 'Buku berhasil dihapus.');
    }

    public function approveBook($id)
    {
        Book::findOrFail($id)->update(['is_approved' => true]);
        return back()->with('success', 'Buku berhasil divalidasi dan ditampilkan di katalog.');
    }

    // ═══════════════════════════════════════════════════════════════
    // CRUD: USER (Admin only)
    // ═══════════════════════════════════════════════════════════════

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') return back()->with('error', 'Tidak bisa menghapus akun admin.');
        $user->delete();
        return back()->with('success', 'User berhasil dihapus.');
    }

    // ═══════════════════════════════════════════════════════════════
    // CRUD: PETUGAS (Admin only)
    // ═══════════════════════════════════════════════════════════════

    public function storeStaff(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
        ]);

        User::create([
            'name' => $request->name, 'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'petugas', 'phone' => $request->phone,
        ]);

        return back()->with('success', 'Petugas berhasil ditambahkan.');
    }

    public function destroyStaff($id)
    {
        $user = User::where('id', $id)->where('role', 'petugas')->firstOrFail();
        $user->delete();
        return back()->with('success', 'Petugas berhasil dihapus.');
    }

    // ═══════════════════════════════════════════════════════════════
    // CRUD: ULASAN (Admin only - delete)
    // ═══════════════════════════════════════════════════════════════

    public function destroyReview($id)
    {
        Review::findOrFail($id)->delete();
        return back()->with('success', 'Ulasan berhasil dihapus.');
    }
}
