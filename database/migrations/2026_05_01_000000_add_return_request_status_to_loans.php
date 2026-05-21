<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Ubah enum status: tambahkan 'menunggu_pengembalian'
        DB::statement("ALTER TABLE loans MODIFY COLUMN status ENUM('pending','dipinjam','dikembalikan','terlambat','ditolak','menunggu_pengembalian') DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE loans MODIFY COLUMN status ENUM('pending','dipinjam','dikembalikan','terlambat','ditolak') DEFAULT 'pending'");
    }
};
