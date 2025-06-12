<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PeriksaSuratKeluar;
use App\Models\User;
use Inertia\Inertia;
use App\Models\DisposisiKeluar;

class PeriksaSuratKeluarController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $periksaSurat = PeriksaSuratKeluar::with(['suratKeluar.kategori']) // jika ada relasi kategori
            ->where('penerima_id', $userId)
            ->latest()
            ->get();

        $users = User::all();

        return Inertia::render('PeriksaSurat/PeriksaSuratKeluar', [
            'periksaSuratKeluar' => $periksaSurat,
            'users' => $users,
        ]);
    }

     public function store(Request $request)
    {

        $request->validate([
            'surat_keluar_id' => 'required|exists:surat_keluars,id',
            'penerima_id' => 'required|exists:users,id',
        ]);

        $penerima = User::findOrFail($request->penerima_id);

        PeriksaSuratKeluar::create([
            'surat_keluar_id' => $request->surat_keluar_id,
            'pengirim_id' => Auth::id(),
            'penerima_id' => $request->penerima_id,
            'status' => 'proses_view',
        ]);

        return back()->with('success', 'Surat keluar berhasil dikirim untuk diperiksa.');
    }

    public function penerima()
    {
        return $this->belongsTo(User::class, 'penerima_id');
    }

     public function terima(Request $request)
    {
        $request->validate([
            'surat_keluar_id' => 'required|exists:surat_keluars,id',
            'penerima_id' => 'required|exists:users,id',
        ]);

        $periksa = PeriksaSuratKeluar::where('surat_keluar_id', $request->surat_keluar_id)
            ->where('penerima_id', $request->penerima_id)
            ->firstOrFail();

        $periksa->status = 'diterima';
        $periksa->tanggal_diperiksa = now();
        $periksa->save();

        return redirect()->back()->with('success', 'Surat keluar diterima.');
    }

     public function disposisi(Request $request)
    {
        $request->validate([
            'surat_keluar_id' => 'required|exists:surat_keluars,id',
            'pengirim_id' => 'required|exists:users,id',
            'penerima_id' => 'required|exists:users,id',
            'tanggal_surat_keluar' => 'required|date',
            'tanggal_terima_surat' => 'required|date',
            'nomor_surat_keluar' => 'required|string',
            'asal_surat' => 'required|string',
            'perihal' => 'required|string',
            'sifat' => 'required|string',
            'tindakan' => 'nullable|array',
            'catatan_disposisi' => 'nullable|string',
        ]);

        try {
            $disposisi = DisposisiKeluar::create([
                'surat_keluar_id' => $request->surat_keluar_id,
                'pengirim_id' => $request->pengirim_id,
                'penerima_id' => $request->penerima_id,
                'tanggal_surat_keluar' => $request->tanggal_surat_keluar,
                'tanggal_terima_surat' => $request->tanggal_terima_surat,
                'nomor_surat_keluar' => $request->nomor_surat_keluar,
                'asal_surat' => $request->asal_surat,
                'perihal' => $request->perihal,
                'sifat' => $request->sifat,
                'tindakan' => is_array($request->tindakan) ? json_encode($request->tindakan) : null,
                'catatan_disposisi' => $request->catatan_disposisi,
            ]);
        } catch (\Exception $e) {
            \Log::error('Gagal simpan disposisi: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal menyimpan disposisi. ' . $e->getMessage()]);
        }

        // update status periksa
        $periksa = PeriksaSuratKeluar::where('surat_keluar_id', $request->surat_keluar_id)
            ->where('penerima_id', $request->penerima_id)
            ->first();

        if ($periksa) {
            $periksa->status = 'didisposisi';
            $periksa->save();
        }

        return redirect()->back()->with('success', 'Disposisi berhasil dikirim dan status diperbarui.');
    }
}
