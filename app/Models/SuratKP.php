<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratKP extends Model
{
    protected $table = 'surat_kp';
    protected $fillable = [
        'tanggal_surat',
        'nomor_surat',
        'lampiran',
        'perihal_surat',
        'tujuan_surat',
        'alamat',
        'kegiatan',
        'prodi',
        'nama_surat',
        'perusahaan',
        'mahasiswa',
        'nim',
        'tembusan',
    ];

}
