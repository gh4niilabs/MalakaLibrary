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
        $documentChunks = $this->retrieveRelevantChunks($message);
        $books = $this->findRelevantBooks($message);
        $context = $this->buildContext($documentChunks, $books);

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

    private function retrieveRelevantChunks(string $message): array
    {
        $ollamaUrl = rtrim((string) config('services.ollama.url'), '/');
        $qdrantUrl = rtrim((string) config('services.qdrant.url'), '/');
        $qdrantKey = (string) config('services.qdrant.key');
        $collection = (string) config('services.qdrant.collection');

        if ($ollamaUrl === '' || $qdrantUrl === '' || $qdrantKey === '') {
            return [];
        }

        try {
            $embedding = Http::timeout(30)->post("{$ollamaUrl}/api/embed", [
                'model' => config('services.ollama.embedding_model'),
                'input' => $message,
            ]);

            if ($embedding->failed() || ! is_array($vector = $embedding->json('embeddings.0'))) {
                report(new \RuntimeException('Chatbot query embedding failed.'));
                return [];
            }

            $search = Http::withHeaders(['api-key' => $qdrantKey])
                ->timeout(20)
                ->post("{$qdrantUrl}/collections/".rawurlencode($collection).'/points/query', [
                    'query' => $vector,
                    'limit' => 4,
                    'with_payload' => true,
                ]);

            if ($search->failed()) {
                report(new \RuntimeException('Qdrant semantic search failed with HTTP '.$search->status().'.'));
                return [];
            }

            return collect($search->json('result.points', []))
                ->map(function (array $point) {
                    $payload = $point['payload'] ?? [];
                    return [
                        'text' => $payload['text'] ?? '',
                        'source' => $payload['source'] ?? 'Dokumen Malaka Library',
                        'page' => $payload['page'] ?? null,
                        'score' => $point['score'] ?? null,
                    ];
                })
                ->filter(fn (array $item) => trim($item['text']) !== '')
                ->values()
                ->all();
        } catch (\Throwable $exception) {
            report($exception);
            return [];
        }
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

    private function buildContext(array $documentChunks, $books): string
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

        $documentInfo = collect($documentChunks)
            ->map(fn (array $chunk) => '[Sumber: '.$chunk['source'].($chunk['page'] ? ', halaman '.$chunk['page'] : '')."]\n{$chunk['text']}")
            ->join("\n\n");

        if ($documentInfo === '') {
            $documentInfo = 'Tidak ada potongan dokumen yang cocok ditemukan.';
        }

        if ($bookInfo === '') {
            $bookInfo = 'Tidak ada informasi katalog yang relevan ditemukan.';
        }

        return "{$libraryInfo}\n\nPotongan dokumen RAG yang paling relevan:\n{$documentInfo}\n\nData katalog buku dari database:\n{$bookInfo}";
    }
}
