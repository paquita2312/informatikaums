<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Perlu ubah dengan raw SQL karena Laravel belum support native ENUM modifikasi
        DB::statement("ALTER TABLE users MODIFY role ENUM('admin_prodi', 'admin_fakultas', 'pimpinan', 'karyawan') NOT NULL DEFAULT 'admin_prodi'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY role ENUM('admin_prodi', 'admin_fakultas', 'pimpinan') NOT NULL DEFAULT 'admin_prodi'");
    }
};
