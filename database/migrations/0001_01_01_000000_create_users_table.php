<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Users (Udah gue gabungin sama spek Malaka Library)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 150)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            // Tambahan spek tugas lo:
            $table->enum('role', ['admin', 'petugas', 'member'])->default('member');
            $table->string('no_anggota', 20)->nullable()->comment('Nomor kartu anggota, khusus member');
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('avatar', 255)->nullable()->comment('Path foto profil');
            $table->boolean('is_active')->default(true);
            
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Tabel Reset Password (JANGAN DIHAPUS, ini bawaan Breeze)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // 3. Tabel Sessions (JANGAN DIHAPUS, buat simpen login user)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};