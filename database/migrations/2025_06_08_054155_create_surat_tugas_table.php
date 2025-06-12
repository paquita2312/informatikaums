<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('surat_tugas', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat');
            $table->string('pemberi_nama');
            $table->string('pemberi_jabatan');
            $table->string('penerima_nama');
            $table->string('penerima_jabatan');
            $table->text('kegiatan');
            $table->string('penyelenggara_acara');
            $table->string('hari_acara');
            $table->date('tanggal_acara');
            $table->string('tempat_acara');
            $table->date('tanggal_surat_kegiatan');
            $table->string('tembusan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_tugas');
    }
};
