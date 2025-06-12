<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PeriksaSuratMasuk;
use App\Models\User;
use Inertia\Inertia;
use App\Models\DisposisiMasuk;

class PeriksaSuratMasukController extends Controller
{
     public function index()
    {
        $userId = Auth::id();

        $periksaSurat = PeriksaSuratMasuk::with(['suratMasuk.kategori'])
            ->where('penerima_id', $userId) // hanya surat yang ditujukan ke user ini
            ->latest()
            ->get();

        $users = User::all(); // jika masih perlu pilihan user untuk kirim surat

        return Inertia::render('PeriksaSurat/PeriksaSuratMasuk', [
            'periksaSuratMasuk' => $periksaSurat,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'surat_masuk_id' => 'required|exists:surat_masuk,id',
            'penerima_id' => 'required|exists:users,id',
        ]);

        $penerima = User::findOrFail($request->penerima_id);

        PeriksaSuratMasuk::create([
            'surat_masuk_id' => $request->surat_masuk_id,
            'pengirim_id' => Auth::id(),
            'penerima_id' => $penerima->id,
            'status' => 'proses_view',
        ]);

        return back()->with('success', 'Surat berhasil dikirim');
    }

    public function penerima()
    {
        return $this->belongsTo(User::class, 'penerima_id');
    }

    public function terima(Request $request)
    {
        $request->validate([
            'surat_masuk_id' => 'required|exists:surat_masuk,id',
            'penerima_id' => 'required|exists:users,id', // sesuaikan sesuai data input
        ]);

        $periksa = PeriksaSuratMasuk::where('surat_masuk_id', $request->surat_masuk_id)
                    ->where('penerima_id', $request->penerima_id)
                    ->firstOrFail();

        $periksa->status = 'diterima';
        $periksa->save();

        return redirect()->back()->with('success', 'Surat berhasil diterima.');

    }

    public function disposisi(Request $request)
    {
        $request->validate([
            'surat_masuk_id' => 'required|exists:surat_masuk,id',
            'pengirim_id' => 'required|exists:users,id',
            'penerima_id' => 'required|exists:users,id',
            'tanggal_surat_masuk' => 'required|date',
            'tanggal_terima_surat' => 'required|date',
            'nomor_surat_masuk' => 'required|string',
            'asal_surat' => 'required|string',
            'perihal' => 'required|string',
            'sifat' => 'required|string',
            'tindakan' => 'nullable|array',
            'catatan_disposisi' => 'nullable|string',
        ]);

        try {
            $disposisi = DisposisiMasuk::create([
                'surat_masuk_id' => $request->surat_masuk_id,
                'pengirim_id' => $request->pengirim_id,
                'penerima_id' => $request->penerima_id,
                'tanggal_surat_masuk' => $request->tanggal_surat_masuk,
                'tanggal_terima_surat' => $request->tanggal_terima_surat,
                'nomor_surat_masuk' => $request->nomor_surat_masuk,
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
        $periksa = PeriksaSuratMasuk::where('surat_masuk_id', $request->surat_masuk_id)
            ->where('penerima_id', $request->penerima_id)
            ->first();

        if ($periksa) {
            $periksa->status = 'didisposisi';
            $periksa->save();
        }

        return redirect()->back()->with('success', 'Disposisi berhasil dikirim dan status diperbarui.');
    }


}
