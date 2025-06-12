<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratDanaRaker extends Model
{
    protected $table = 'surat_dana_raker';

    protected $fillable = [
        'tanggal_surat',
        'nomor_surat',
        'lampiran',
        'perihal_surat',
        'tujuan_surat',
        'agenda',
        'hari_acara',
        'tanggal_acara',
        'keterangan',
        'kegiatan',
        'nominal',
        'tembusan',
    ];

    public function anggaran()
    {
        return $this->hasMany(AnggaranRaker::class);
    }
}
