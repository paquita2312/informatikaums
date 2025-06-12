<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriksaSuratKeluar extends Model
{
    use HasFactory;

    protected $table = 'periksa_surat_keluar';

    protected $fillable = [
        'surat_keluar_id',
        'pengirim_id',
        'penerima_id',
        'status',
        'catatan',
        'tanggal_diperiksa',
    ];

    public function suratKeluar()
    {
        return $this->belongsTo(SuratKeluar::class);
    }

    public function pengirim()
    {
        return $this->belongsTo(User::class, 'pengirim_id');
    }

    public function penerima()
    {
        return $this->belongsTo(User::class, 'penerima_id');
    }
}
