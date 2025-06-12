<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratTugas extends Model
{
    protected $table = 'surat_tugas';

    protected $fillable = [
        'nomor_surat',
        'pemberi_nama',
        'pemberi_jabatan',
        'penerima_nama',
        'penerima_jabatan',
        'kegiatan',
        'penyelenggara_acara',
        'hari_acara',
        'tanggal_acara',
        'tempat_acara',
        'tanggal_surat_kegiatan',
        'tembusan',
    ];
}
