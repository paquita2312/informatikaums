<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaftarWali extends Model
{

    protected $table = 'daftar_wali';

    protected $fillable = ['sk_dekan_id', 'nama_dosen'];

    public function mahasiswa()
    {
        return $this->hasMany(MahasiswaWali::class);
    }

    public function sk()
    {
        return $this->belongsTo(SKDekan::class, 'sk_dekan_id');
    }
}
