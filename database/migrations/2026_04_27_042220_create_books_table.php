<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke petugas/admin yang input
            $table->foreignId('added_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('title', 200);
            $table->string('author', 150);
            $table->string('publisher', 150);
            $table->string('isbn', 20)->unique()->nullable();
            $table->year('year')->nullable();
            $table->integer('stock')->default(0);
            $table->integer('available')->default(0); // Stok yang bisa dipinjam
            $table->string('cover', 255)->nullable();
            $table->text('description')->nullable();
            
            // Status approval (fitur petugas tambah buku perlu acc admin)
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};