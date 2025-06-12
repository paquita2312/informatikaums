<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuratKeluar extends Model
{
    use HasFactory;

    protected $table = 'surat_keluars';

    protected $fillable = [
        'tanggal_surat_keluar',
        'no_agenda',
        'kode_surat',
        'no_surat',
        'tanggal_surat',
        'kategori_id',
        'penerima',
        'lampiran',
        'berkas',
        'user_id',
    ];

    public function kategori()
    {
        return $this->belongsTo(KategoriSurat::class, 'kategori_id');
    }

    public function periksaSuratKeluar()
    {
        return $this->hasMany(PeriksaSuratKeluar::class, 'surat_keluar_id');
    }
}
