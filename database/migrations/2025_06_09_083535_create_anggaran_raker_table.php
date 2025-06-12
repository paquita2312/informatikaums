<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('anggaran_raker', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_dana_raker_id')->constrained('surat_dana_raker')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('anggaran_raker')->onDelete('cascade');
            $table->string('uraian');
            $table->integer('unit')->default(0);
            $table->integer('harga')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggaran_raker');
    }
};
