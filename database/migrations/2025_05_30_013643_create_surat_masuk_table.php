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
        Schema::create('surat_masuk', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_surat_masuk');
            $table->string('no_agenda');
            $table->date('tanggal_surat');
            $table->foreignId('kategori_id')->constrained('kategori_surats')->onDelete('cascade');
            $table->string('pengirim');
            $table->string('lampiran');
            $table->string('berkas'); // path file upload
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_masuk');
    }
};
