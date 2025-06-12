<?php

namespace App\Http\Controllers;

use App\Models\DisposisiMasuk;
use App\Models\DisposisiKeluar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DisposisiController extends Controller
{
    public function index()
    {
        return Inertia::render('Disposisi/Index');
    }

    public function search(Request $request)
    {
        $jenis = $request->input('jenis'); // 'masuk' atau 'keluar'
        $tanggal = $request->input('tanggal');

        if ($jenis === 'masuk') {
            $data = DisposisiMasuk::with('pengirim')
                ->where(function ($query) use ($tanggal) {
                    if ($tanggal) {
                        $query->whereDate('tanggal_surat_masuk', $tanggal);
                    }
                })->get();
        } else {
            $data = DisposisiKeluar::with('pengirim')
                ->where(function ($query) use ($tanggal) {
                    if ($tanggal) {
                        $query->whereDate('tanggal_surat_keluar', $tanggal);
                    }
                })->get();
        }
        return response()->json($data);
    }


}
