<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisposisiMasuk extends Model
{
    use HasFactory;

    protected $table = 'disposisi_masuk';

    protected $fillable = [
        'surat_masuk_id',
        'pengirim_id',
        'penerima_id',
        'tanggal_surat_masuk',
        'tanggal_terima_surat',
        'nomor_surat_masuk',
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
