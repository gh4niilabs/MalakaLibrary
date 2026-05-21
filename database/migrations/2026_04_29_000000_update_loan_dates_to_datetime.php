<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dateTime('borrow_date')->nullable()->change();
            $table->dateTime('due_date')->nullable()->change();
            $table->dateTime('return_date')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->date('borrow_date')->nullable()->change();
            $table->date('due_date')->nullable()->change();
            $table->date('return_date')->nullable()->change();
        });
    }
};
