<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Lokasi: database/migrations/2024_01_01_000006_create_favorites_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('book_id')->constrained('books')->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            // 1 user tidak bisa bookmark buku yang sama 2 kali
            $table->unique(['user_id', 'book_id'], 'unique_favorite');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};