<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SKDekan extends Model
{
    protected $table = 'sk_dekan';

    protected $fillable = ['nomor_surat', 'tahun_akademik', 'prodi', 'kota', 'tanggal_ttd', 'tembusan'];

    public function daftarWali()
    {
        return $this->hasMany(DaftarWali::class);
    }
}
