<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SuratMasuk;
use App\Models\KategoriSurat;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\PeriksaSuratMasuk;


class SuratMasukController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Surat yang belum dikirim/periksa
        $queryBelum = SuratMasuk::with('kategori')
            ->whereDoesntHave('periksaSuratMasuk');

        if (in_array($user->role, ['admin_prodi', 'admin_fakultas'])) {
            $userIds = User::where('role', $user->role)->pluck('id');
            $queryBelum->whereIn('user_id', $userIds);
        } else {
            $queryBelum->where('user_id', $user->id);
        }

        $suratBelum = $queryBelum->orderBy('created_at', 'desc')->get();

        // Surat yang sudah diperiksa/kirim
        $suratSudah = SuratMasuk::with(['kategori', 'periksaSuratMasuk' => function ($q) use ($user) {
            $q->where('penerima_id', $user->id)->orWhere('pengirim_id', $user->id);
        }])
            ->whereHas('periksaSuratMasuk')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $kategori = KategoriSurat::all();
        $users = User::all();

        return Inertia::render('Surat/SuratMasuk', [
            'suratMasuk' => $suratBelum,
            'suratTerkirim' => $suratSudah,
            'kategori' => $kategori,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tanggal_surat_masuk' => 'required|date',
            'no_agenda' => 'required|string',
            'tanggal_surat' => 'required|date',
            'kategori_id' => 'required|exists:kategori_surats,id',
            'pengirim' => 'required|string',
            'lampiran' => 'nullable|string',
            'berkas' => 'required|file|mimes:pdf,jpg,jpeg,png|max:12240'
        ]);

        $user = auth()->user();
        \Log::info('STORE: validasi berhasil', $data);
        $berkasPath = $request->file('berkas')->store('berkas', 'public');

        SuratMasuk::create([
            'tanggal_surat_masuk' => $request->tanggal_surat_masuk,
            'no_agenda' => $request->no_agenda,
            'tanggal_surat' => $request->tanggal_surat,
            'kategori_id' => $request->kategori_id,
            'pengirim' => $request->pengirim,
            'lampiran' => $request->lampiran,
            'berkas' => $berkasPath,

            // untuk filter berdasarkan role
            'prodi_id' => $user->prodi_id,
            'fakultas_id' => $user->fakultas_id,
            'user_id' => $user->id,
        ]);

        return redirect()->route('suratmasuk.index');
    }

    public function update(Request $request, $id)
    {
        \Log::info('UPDATE HIT: masuk ke fungsi update');
        $surat = SuratMasuk::findOrFail($id);

        $data = $request->validate([
            'tanggal_surat_masuk' => 'required|date',
            'no_agenda' => 'required|string',
            'tanggal_surat' => 'required|date',
            'kategori_id' => 'required|exists:kategori_surats,id',
            'pengirim' => 'required|string',
            'lampiran' => 'nullable|string',
            'berkas' => 'nullable|file|mimes:pdf,jpg,jpeg,png'
        ]);

        \Log::info('UPDATE: Data Diterima', $data);

        if ($request->hasFile('berkas')) {
            Storage::disk('public')->delete($surat->berkas);
            $data['berkas'] = $request->file('berkas')->store('berkas', 'public');
        }

        $surat->update($data);

        return redirect()->route('suratmasuk.index')->with('success', 'Surat berhasil diupdate');
    }

    public function destroy($id)
    {
        $surat = SuratMasuk::findOrFail($id);
        Storage::disk('public')->delete($surat->berkas);
        $surat->delete();

        return redirect()->route('suratmasuk.index');
    }

    public function show($id)
    {
        return response()->json(SuratMasuk::with('kategori')->findOrFail($id));
         return response()->json($surat);
    }
}
