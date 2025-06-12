<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuratMasuk extends Model
{
    use HasFactory;

    protected $table = 'surat_masuk';
    protected $fillable = [
        'tanggal_surat_masuk', 'no_agenda', 'tanggal_surat', 'kategori_id', 'pengirim', 'lampiran', 'berkas','user_id','status_disposisi'
    ];

    public function kategori()
    {
        return $this->belongsTo(KategoriSurat::class);
    }
    public function periksaSuratMasuk()
    {
        return $this->hasMany(PeriksaSuratMasuk::class);
    }

}

