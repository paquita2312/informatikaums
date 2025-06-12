<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MahasiswaWali extends Model
{
    protected $table = 'mahasiswa';
    protected $fillable = ['daftar_wali_id', 'nim', 'nama_mahasiswa'];

    public function wali()
    {
        return $this->belongsTo(DaftarWali::class, 'daftar_wali_id');
    }
}
