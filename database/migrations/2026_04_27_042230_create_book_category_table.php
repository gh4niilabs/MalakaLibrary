<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tabel pivot untuk relasi Many-to-Many antara Books dan Categories

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('book_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('books')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->timestamps();

            // 1 buku gak bisa punya kategori yang sama 2 kali
            $table->unique(['book_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_category');
    }
};
