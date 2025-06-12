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
        Schema::create('sk_dekan', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat');
            $table->string('tahun_akademik');
            $table->string('prodi');
            $table->string('kota');
            $table->date('tanggal_ttd');
            $table->text('tembusan')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sk_dekan');
    }
};
