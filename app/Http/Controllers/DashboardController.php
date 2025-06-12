<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use App\Models\PeriksaSuratMasuk;
use App\Models\PeriksaSuratKeluar;
use App\Models\User;


class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->role->value; // pastikan ada kolom `role` di tabel users
        $userId = $user->id;

        // Ambil ID surat masuk yang sudah diperiksa
        $sudahDiperiksaIds = PeriksaSuratMasuk::pluck('surat_masuk_id')->toArray();

        // Hitung surat masuk berdasarkan role (yang belum diperiksa)
        $suratMasukCount = 0;
        if (in_array($role, ['admin_prodi', 'admin_fakultas'])) {
            $suratMasukCount = SuratMasuk::where('user_id', $userId)
                ->whereNotIn('id', $sudahDiperiksaIds)
                ->count();
        }

        $suratBelumDiperiksa = SuratMasuk::where('user_id', $userId)
            ->whereNotIn('id', $sudahDiperiksaIds)
            ->get();

        if ($role === 'admin_fakultas') {
            $periksaSuratMasukCount = PeriksaSuratMasuk::where('status', 'proses_view')
                ->where('penerima_id', $userId)
                ->count();
        }
         elseif (in_array($role, ['pimpinan', 'karyawan'])) {
            $periksaSuratMasukCount = PeriksaSuratMasuk::where('penerima_id', $userId)->count();
        } else {
            // fallback default untuk role lain (bisa disesuaikan)
            $periksaSuratMasukCount = PeriksaSuratMasuk::where('penerima_id', $userId)
                ->whereNull('status')
                ->count();
        }

        // Kumpulan data untuk dikirim ke frontend
        $data = [
            'surat_masuk' => $suratMasukCount,
            'periksa_surat_masuk' => $periksaSuratMasukCount,
            // 'disposisi' => Disposisi::where('pengirim_id', $userId)->count(),
            'pengguna' => User::count(),
            'role' => $role,
        ];

        return Inertia::render('Dashboard', [
            'data' => $data,
            'suratBelumDiperiksa' => $suratBelumDiperiksa,
        ]);

    }
}
