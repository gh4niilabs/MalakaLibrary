<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Lokasi: database/migrations/2024_01_01_000005_create_reviews_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('book_id')->constrained('books')->cascadeOnDelete();
            $table->foreignId('loan_id')->nullable()->constrained('loans')->nullOnDelete()->comment('Validasi user pernah pinjam buku ini');
            $table->tinyInteger('rating')->comment('Nilai 1-5');
            $table->text('comment')->nullable();
            $table->timestamps();

            // 1 user hanya bisa review 1 buku 1 kali
            $table->unique(['user_id', 'book_id'], 'unique_review_per_book');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};