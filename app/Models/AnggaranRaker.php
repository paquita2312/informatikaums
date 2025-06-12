<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnggaranRaker extends Model
{
    protected $table = 'anggaran_raker';

    protected $fillable = [
        'surat_dana_raker_id',
        'parent_id',
        'uraian',
        'unit',
        'harga',
    ];

    public function surat()
    {
        return $this->belongsTo(SuratDanaRaker::class, 'surat_dana_raker_id');
    }

    public function parent()
    {
        return $this->belongsTo(AnggaranRaker::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(AnggaranRaker::class, 'parent_id');
    }
}
