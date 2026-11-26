<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Smalot\PdfParser\Parser;
use Throwable;

class IngestRagPdf extends Command
{
    protected $signature = 'rag:ingest {path? : PDF path; defaults to storage/app/rag/malaka-library.pdf}';

    protected $description = 'Extract a PDF, chunk its text, create Ollama embeddings, and index them in Qdrant.';

    private const CHUNK_SIZE = 1200;
    private const CHUNK_OVERLAP = 160;

    public function handle(): int
    {
        $path = $this->argument('path') ?: storage_path('app/rag/malaka-library.pdf');
        $path = str_starts_with($path, DIRECTORY_SEPARATOR) || preg_match('/^[A-Za-z]:\\\\/', $path)
            ? $path
            : base_path($path);

        if (! is_file($path)) {
            $this->error("PDF tidak ditemukan: {$path}");
            return self::FAILURE;
        }

        $qdrantUrl = rtrim((string) config('services.qdrant.url'), '/');
        $qdrantKey = (string) config('services.qdrant.key');
        $collection = (string) config('services.qdrant.collection');
        $ollamaUrl = rtrim((string) config('services.ollama.url'), '/');
        $embeddingModel = (string) config('services.ollama.embedding_model');
        $vectorSize = (int) config('services.qdrant.vector_size');

        if ($qdrantUrl === '' || $qdrantKey === '') {
            $this->error('QDRANT_URL dan QDRANT_API_KEY harus diisi di .env.');
            return self::FAILURE;
        }

        try {
            // The Sail bind mount can delay Composer's generated PSR-0 map on Windows.
            spl_autoload_register(function (string $class): void {
                $prefix = 'Smalot\\PdfParser\\';
                if (! str_starts_with($class, $prefix)) {
                    return;
                }

                $classPath = 'vendor/smalot/pdfparser/src/Smalot/PdfParser/'.str_replace('\\', '/', substr($class, strlen($prefix))).'.php';
                if (is_file(base_path($classPath))) {
                    require_once base_path($classPath);
                }
            });

            $pdf = (new Parser())->parseFile($path);
            $chunks = [];

            foreach ($pdf->getPages() as $pageIndex => $page) {
                $text = $this->normalizeText($page->getText());
                foreach ($this->chunkText($text) as $chunkIndex => $chunk) {
                    $chunks[] = [
                        'text' => $chunk,
                        'page' => $pageIndex + 1,
                        'chunk_index' => $chunkIndex,
                    ];
                }
            }
        } catch (Throwable $exception) {
            $this->error('Gagal membaca PDF: '.$exception->getMessage());
            return self::FAILURE;
        }

        if ($chunks === []) {
            $this->error('PDF tidak menghasilkan teks. Pastikan PDF bukan hasil scan gambar tanpa OCR.');
            return self::FAILURE;
        }

        $this->info('PDF terbaca: '.count($pdf->getPages()).' halaman, '.count($chunks).' chunks.');
        $points = [];

        foreach ($chunks as $index => $chunk) {
            try {
                $embeddingResponse = Http::timeout(90)->post("{$ollamaUrl}/api/embed", [
                    'model' => $embeddingModel,
                    'input' => $chunk['text'],
                ]);
            } catch (Throwable $exception) {
                $this->error('Tidak bisa menghubungi Ollama: '.$exception->getMessage());
                return self::FAILURE;
            }

            if ($embeddingResponse->failed()) {
                $this->error('Ollama gagal membuat embedding (HTTP '.$embeddingResponse->status().').');
                return self::FAILURE;
            }

            $vector = $embeddingResponse->json('embeddings.0');
            if (! is_array($vector) || count($vector) !== $vectorSize) {
                $actualSize = is_array($vector) ? count($vector) : 0;
                $this->error("Dimensi embedding {$actualSize} tidak cocok dengan QDRANT_VECTOR_SIZE={$vectorSize}.");
                return self::FAILURE;
            }

            $source = basename($path);
            $points[] = [
                'id' => $this->pointId($source, $chunk['page'], $chunk['chunk_index'], $chunk['text']),
                'vector' => $vector,
                'payload' => [
                    'text' => $chunk['text'],
                    'source' => $source,
                    'page' => $chunk['page'],
                    'chunk_index' => $chunk['chunk_index'],
                ],
            ];

            $this->output->write("\rEmbedding: ".($index + 1).'/'.count($chunks));
        }

        $this->newLine();
        $headers = ['api-key' => $qdrantKey];
        $baseUrl = "{$qdrantUrl}/collections/".rawurlencode($collection);

        try {
            $collectionResponse = Http::withHeaders($headers)->timeout(20)->get($baseUrl);
            if ($collectionResponse->failed()) {
                $this->error("Qdrant collection '{$collection}' tidak bisa diakses (HTTP {$collectionResponse->status()}).");
                return self::FAILURE;
            }

            $indexResponse = Http::withHeaders($headers)->timeout(30)->put("{$baseUrl}/index?wait=true", [
                'field_name' => 'source',
                'field_schema' => 'keyword',
            ]);
            if ($indexResponse->failed() && ! str_contains(mb_strtolower($indexResponse->body()), 'already exists')) {
                $this->error('Gagal menyiapkan payload index source (HTTP '.$indexResponse->status().'): '.$indexResponse->body());
                return self::FAILURE;
            }

            $deleteResponse = Http::withHeaders($headers)->timeout(30)->post("{$baseUrl}/points/delete?wait=true", [
                'filter' => ['must' => [['key' => 'source', 'match' => ['value' => basename($path)]]]],
            ]);
            if ($deleteResponse->failed()) {
                $this->error('Gagal mengganti indeks lama (HTTP '.$deleteResponse->status().'): '.$deleteResponse->body());
                return self::FAILURE;
            }

            foreach (array_chunk($points, 32) as $batch) {
                $upsertResponse = Http::withHeaders($headers)->timeout(60)->put("{$baseUrl}/points?wait=true", [
                    'points' => $batch,
                ]);
                if ($upsertResponse->failed()) {
                    $this->error('Qdrant menolak penyimpanan points (HTTP '.$upsertResponse->status().').');
                    return self::FAILURE;
                }
            }
        } catch (Throwable $exception) {
            $this->error('Koneksi ke Qdrant gagal: '.$exception->getMessage());
            return self::FAILURE;
        }

        $this->info('Selesai. '.count($points).' chunks dari '.$source.' sudah diindeks ke Qdrant.');
        return self::SUCCESS;
    }

    private function normalizeText(string $text): string
    {
        $text = preg_replace('/\x{00A0}/u', ' ', $text) ?? $text;
        $text = preg_replace('/[ \t]+/u', ' ', $text) ?? $text;
        $text = preg_replace('/\R{3,}/u', "\n\n", $text) ?? $text;
        return trim($text);
    }

    private function chunkText(string $text): array
    {
        if ($text === '') {
            return [];
        }

        $paragraphs = preg_split('/\n\s*\n/u', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [$text];
        $chunks = [];
        $current = '';

        foreach ($paragraphs as $paragraph) {
            $paragraph = trim($paragraph);
            while (mb_strlen($paragraph) > self::CHUNK_SIZE) {
                $cut = mb_strrpos(mb_substr($paragraph, 0, self::CHUNK_SIZE), ' ');
                $cut = $cut === false ? self::CHUNK_SIZE : $cut;
                $piece = trim(mb_substr($paragraph, 0, $cut));
                if ($current !== '') {
                    $chunks[] = $current;
                    $current = '';
                }
                if ($piece !== '') {
                    $chunks[] = $piece;
                }
                $paragraph = trim(mb_substr($paragraph, max(1, $cut - self::CHUNK_OVERLAP)));
            }

            $candidate = $current === '' ? $paragraph : $current."\n\n".$paragraph;
            if ($current !== '' && mb_strlen($candidate) > self::CHUNK_SIZE) {
                $chunks[] = $current;
                $current = $paragraph;
            } else {
                $current = $candidate;
            }
        }

        if ($current !== '') {
            $chunks[] = $current;
        }

        return array_values(array_filter($chunks, fn ($chunk) => mb_strlen($chunk) > 20));
    }

    private function pointId(string $source, int $page, int $chunkIndex, string $text): string
    {
        $hex = substr(hash('sha256', implode("\0", [$source, $page, $chunkIndex, $text])), 0, 32);
        $hex[12] = '5';
        $hex[16] = dechex((hexdec($hex[16]) & 0x3) | 0x8);
        return substr($hex, 0, 8).'-'.substr($hex, 8, 4).'-'.substr($hex, 12, 4).'-'.substr($hex, 16, 4).'-'.substr($hex, 20, 12);
    }
}
