<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('surat_kp', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_surat');
            $table->string('nomor_surat');
            $table->string('lampiran')->nullable();
            $table->string('perihal_surat');
            $table->string('tujuan_surat');
            $table->string('alamat');
            $table->string('kegiatan');
            $table->string('prodi');
            $table->string('nama_surat');
            $table->string('perusahaan');
            $table->string('mahasiswa');
            $table->string('nim');
            $table->string('tembusan')->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_kp');
    }
};
