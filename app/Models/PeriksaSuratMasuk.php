<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriksaSuratMasuk extends Model
{
    use HasFactory;

    protected $table = 'periksa_surat_masuk';

    protected $fillable = [
        'surat_masuk_id',
        'pengirim_id',
        'penerima_id',
        'status',
        'dibaca_pada',
    ];

    protected $casts = [
        'dibaca_pada' => 'datetime',
    ];

    // Relasi ke surat masuk
    public function suratMasuk()
    {
        return $this->belongsTo(SuratMasuk::class, 'surat_masuk_id');
    }

    // Relasi ke user pengirim
    public function pengirim()
    {
        return $this->belongsTo(User::class, 'pengirim_id');
    }

    // Relasi ke user penerima
    public function penerima()
    {
        return $this->belongsTo(User::class, 'penerima_id');
    }
}
