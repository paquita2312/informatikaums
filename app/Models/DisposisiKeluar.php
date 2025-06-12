<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisposisiKeluar extends Model
{
    use HasFactory;

    protected $table = 'disposisi_keluar';

    protected $fillable = [
        'surat_keluar_id',
        'pengirim_id',
        'penerima_id',
        'tanggal_surat_keluar',
        'tanggal_terima_surat',
        'nomor_surat_keluar',
        'asal_surat',
        'perihal',
        'sifat',
        'tindakan',
        'catatan_disposisi',
    ];

    // Relasi ke User (pengirim)
    public function pengirim()
    {
        return $this->belongsTo(User::class, 'pengirim_id');
    }

    // Relasi ke User (penerima disposisi)
    public function penerima()
    {
        return $this->belongsTo(User::class, 'penerima_id');
    }

}
