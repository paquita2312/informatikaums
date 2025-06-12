<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periksa_surat_masuk', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('surat_masuk_id');
            $table->unsignedBigInteger('pengirim_id');
            $table->unsignedBigInteger('penerima_id');
            $table->enum('status', ['proses_view', 'diterima', 'ditolak'])->default('proses_view');
            $table->timestamp('dibaca_pada')->nullable();
            $table->timestamps();

            $table->foreign('surat_masuk_id')
                  ->references('id')->on('surat_masuk')
                  ->onDelete('cascade');

            $table->foreign('pengirim_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');

            $table->foreign('penerima_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('periksa_surat_masuk');
    }
};
