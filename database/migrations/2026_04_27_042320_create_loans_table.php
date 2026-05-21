<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            
            // Member yang minjam
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            // Buku yang dipinjam
            $table->foreignId('book_id')->constrained('books')->cascadeOnDelete();
            
            // Siapa petugas yang memvalidasi (bisa admin/petugas)
            $table->foreignId('petugas_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->date('borrow_date')->nullable()->comment('Diisi pas buku diambil/status jadi dipinjam');
            $table->date('due_date')->nullable()->comment('Tanggal harus balik');
            $table->date('return_date')->nullable()->comment('Tanggal aktual buku dibalikin');
            
            // Status alur peminjaman
            $table->enum('status', [
                'pending',      // Baru booking di web
                'dipinjam',     // Buku udah dibawa
                'dikembalikan', // Udah balik
                'terlambat',    // Lewat jatuh tempo
                'ditolak'       // Booking ditolak petugas
            ])->default('pending');
            
            // Fitur perpanjang
            $table->boolean('is_extended')->default(false);
            $table->date('extended_due_date')->nullable();
            
            $table->text('notes')->nullable()->comment('Catatan misal: Buku lecet dikit');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};