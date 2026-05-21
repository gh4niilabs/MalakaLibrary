<?php
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\KatalogController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RiwayatController;
use App\Http\Controllers\FavoriteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ═══════════════════════════════════════════════════════════════════
// 1. PUBLIC PAGES
// ═══════════════════════════════════════════════════════════════════
Route::get('/', function () {
    $popularBooks = \App\Models\Book::where('is_approved', true)
        ->withCount('loans')
        ->orderByDesc('loans_count')
        ->take(6)
        ->get();
    $latestReviews = \App\Models\Review::with(['user', 'book'])
        ->latest()
        ->take(3)
        ->get()
        ->map(fn($r) => [
            'id' => $r->id,
            'user_name' => $r->user->name ?? '-',
            'book_title' => $r->book->title ?? '-',
            'rating' => $r->rating,
            'comment' => $r->comment,
            'created_at' => $r->created_at?->format('d M Y'),
        ]);
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'popularBooks' => $popularBooks,
        'latestReviews' => $latestReviews,
    ]);
})->name('home');
Route::get('/about', fn() => Inertia::render('Dashboard'))->name('about');
Route::get('/katalog', [KatalogController::class, 'index'])->name('katalog.index');

// ═══════════════════════════════════════════════════════════════════
// 2. MEMBER PAGES (Requires Login)
// ═══════════════════════════════════════════════════════════════════
Route::middleware('auth')->group(function () {
    // Favorit
    Route::post('/favorites/{id}/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
    // Peminjaman
    Route::post('/pinjam', [LoanController::class, 'store'])->name('loans.store');
    Route::patch('/loans/{id}/request-return', [LoanController::class, 'requestReturn'])->name('loans.requestReturn');

    // Ulasan (CRUD)
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::patch('/reviews/{id}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Pages
    Route::get('/favorit', [FavoriteController::class, 'index'])->name('favorit');
    Route::get('/riwayat', [RiwayatController::class, 'index'])->name('riwayat');

    // Profile (Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ═══════════════════════════════════════════════════════════════════
// 3. ADMIN/PETUGAS PAGES
// ═══════════════════════════════════════════════════════════════════
Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])->name('admin.login.submit');

Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Dashboard
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');
    Route::get('/loans', [AdminController::class, 'loans'])->name('loans');

    // Loan Actions
    Route::patch('/loans/{id}/approve', [AdminController::class, 'approveLoan'])->name('loans.approve');
    Route::patch('/loans/{id}/reject', [AdminController::class, 'rejectLoan'])->name('loans.reject');
    Route::patch('/loans/{id}/approve-return', [AdminController::class, 'approveReturn'])->name('loans.approveReturn');
    Route::patch('/loans/{id}/reject-return', [AdminController::class, 'rejectReturn'])->name('loans.rejectReturn');

    // CRUD: Kategori (Admin only)
    Route::post('/categories', [AdminController::class, 'storeCategory'])->name('categories.store');
    Route::patch('/categories/{id}', [AdminController::class, 'updateCategory'])->name('categories.update');
    Route::delete('/categories/{id}', [AdminController::class, 'destroyCategory'])->name('categories.destroy');

    // CRUD: Buku (Admin + Petugas)
    Route::post('/books', [AdminController::class, 'storeBook'])->name('books.store');
    Route::patch('/books/{id}', [AdminController::class, 'updateBook'])->name('books.update');
    Route::delete('/books/{id}', [AdminController::class, 'destroyBook'])->name('books.destroy');
    Route::patch('/books/{id}/approve', [AdminController::class, 'approveBook'])->name('books.approve');

    // CRUD: User (Admin only)
    Route::delete('/users/{id}', [AdminController::class, 'destroyUser'])->name('users.destroy');

    // CRUD: Petugas (Admin only)
    Route::post('/staff', [AdminController::class, 'storeStaff'])->name('staff.store');
    Route::delete('/staff/{id}', [AdminController::class, 'destroyStaff'])->name('staff.destroy');

    // CRUD: Ulasan (Admin delete)
    Route::delete('/reviews/{id}', [AdminController::class, 'destroyReview'])->name('reviews.destroy');
});

require __DIR__.'/auth.php';