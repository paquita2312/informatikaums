<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daftar_wali', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sk_dekan_id')->constrained('sk_dekan')->onDelete('cascade');
            $table->string('nama_dosen');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daftar_wali');
    }
};
