<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $message = trim($data['message']);
        $books = $this->findRelevantBooks($message);
        $context = $this->buildContext($books);

        $response = Http::timeout(45)
            ->withToken(config('services.openrouter.key'))
            ->withHeaders([
                'HTTP-Referer' => config('app.url'),
                'X-Title' => 'Malaka Library',
            ])
            ->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => config('services.openrouter.model', 'openrouter/free'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Kamu adalah Malaka Assistant, asisten resmi website Malaka Library. Jawab dalam bahasa Indonesia yang ramah dan ringkas. Gunakan konteks yang diberikan. Jangan mengarang judul buku, stok, aturan, atau informasi lain. Jika informasi tidak ada di konteks, katakan bahwa informasinya belum tersedia dan arahkan pengguna ke halaman Katalog Buku. Jangan mengaku sebagai manusia.',
                    ],
                    [
                        'role' => 'user',
                        'content' => "Konteks pengetahuan Malaka Library:\n{$context}\n\nPertanyaan pengguna:\n{$message}",
                    ],
                ],
            ]);

        if ($response->failed()) {
            report($response->toException());

            return response()->json([
                'message' => 'Maaf, layanan chatbot sedang tidak tersedia. Coba lagi beberapa saat lagi.',
            ], 502);
        }

        return response()->json([
            'message' => $response->json('choices.0.message.content') ?: 'Maaf, belum ada jawaban yang bisa diberikan.',
        ]);
    }

    private function findRelevantBooks(string $message)
    {
        $words = collect(preg_split('/[^\pL\pN]+/u', mb_strtolower($message)))
            ->filter(fn ($word) => mb_strlen($word) >= 4)
            ->unique()
            ->take(8);

        $query = Book::query()
            ->with('categories')
            ->where('is_approved', true)
            ->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('title', 'like', "%{$word}%")
                        ->orWhere('author', 'like', "%{$word}%")
                        ->orWhere('publisher', 'like', "%{$word}%")
                        ->orWhere('description', 'like', "%{$word}%");
                }
            });

        $books = $query->latest()->take(8)->get();

        return $books->isEmpty()
            ? Book::with('categories')->where('is_approved', true)->latest()->take(8)->get()
            : $books;
    }

    private function buildContext($books): string
    {
        $libraryInfo = <<<'INFO'
Nama layanan: Malaka Library.
Jenis layanan: katalog buku online, informasi koleksi, favorit, peminjaman, dan riwayat peminjaman.
Arahkan pengguna ke halaman Katalog Buku untuk melihat koleksi dan ketersediaan terbaru.
INFO;

        $bookInfo = $books->map(function ($book) {
            $categories = $book->categories->pluck('name')->join(', ') ?: 'Belum dikategorikan';
            return "- {$book->title} | Penulis: {$book->author} | Penerbit: {$book->publisher} | Tahun: {$book->year} | Tersedia: {$book->available}/{$book->stock} | Kategori: {$categories}";
        })->join("\n");

        return "{$libraryInfo}\n\nKoleksi buku yang relevan dari database:\n{$bookInfo}";
    }
}
