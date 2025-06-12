<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_keluars', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_surat_keluar');
            $table->string('no_agenda');
            $table->string('kode_surat');
            $table->string('no_surat');
            $table->date('tanggal_surat');
            $table->foreignId('kategori_id')->constrained('kategori_surats')->onDelete('cascade');
            $table->string('penerima');
            $table->string('lampiran');
            $table->string('berkas'); // path file upload
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_keluars');
    }
};
