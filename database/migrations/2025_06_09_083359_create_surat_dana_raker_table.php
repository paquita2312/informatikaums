<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('surat_dana_raker', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_surat');
            $table->string('nomor_surat');
            $table->string('lampiran')->nullable();
            $table->string('perihal_surat');
            $table->string('tujuan_surat');
            $table->text('agenda');
            $table->string('hari_acara');
            $table->date('tanggal_acara');
            $table->string('keterangan');
            $table->text('kegiatan');
            $table->string('nominal');
            $table->string('tembusan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_dana_raker');
    }
};
