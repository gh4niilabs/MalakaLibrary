<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Lokasi: database/migrations/2024_01_01_000004_create_fines_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->unique()->constrained('loans')->cascadeOnDelete()->comment('1 pinjaman = max 1 denda');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('days_late')->default(0)->comment('Jumlah hari terlambat');
            $table->decimal('fine_per_day', 10, 2)->default(1500.00)->comment('Tarif denda per hari Rp');
            $table->decimal('total_fine', 10, 2)->default(0)->comment('days_late x fine_per_day');
            $table->enum('status', ['unpaid', 'paid'])->default('unpaid');
            $table->timestamp('paid_at')->nullable()->comment('Kapan denda dibayar');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fines');
    }
};