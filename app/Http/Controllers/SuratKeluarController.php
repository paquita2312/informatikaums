<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\KategoriSurat;
use Illuminate\Http\Request;
use App\Models\SuratKeluar;
use Illuminate\Support\Facades\Storage;
use App\Models\PeriksaSuratKeluar;


class SuratKeluarController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $queryBelum = SuratKeluar::with('kategori')
            ->whereDoesntHave('periksaSuratKeluar');

        if (in_array($user->role, ['admin_prodi', 'admin_fakultas'])) {
            $userIds = User::where('role', $user->role)->pluck('id');
            $queryBelum->whereIn('user_id', $userIds);
        } else {
            $queryBelum->where('user_id', $user->id);
        }

        $suratBelum = $queryBelum->orderBy('created_at', 'desc')->get();

        // Surat keluar yang sudah diperiksa/dikirim
        $suratSudah = SuratKeluar::with([
            'kategori',
            'periksaSuratKeluar' => function ($query) use ($user) {
                $query->where('penerima_id', $user->id)
                    ->orWhere('pengirim_id', $user->id);
            }
        ])
        ->whereHas('periksaSuratKeluar')
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

        $kategoriSurat = KategoriSurat::all();
        $users = User::all();

        return Inertia::render('Surat/SuratKeluar', [
            'suratKeluar' => $suratBelum,
            'suratTerkirim' => $suratSudah,
            'kategoriSurat' => $kategoriSurat,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        // Ambil user yang sedang login
        $user = auth()->user();

        // Logging user info dan user_id untuk debugging
        \Log::info('User saat store surat keluar:', ['user' => $user]);
        \Log::info('User ID saat store surat keluar:', ['user_id' => $user ? $user->id : null]);

        // Validasi data request (sesuaikan dengan kebutuhan)
        $validatedData = $request->validate([
            'tanggal_surat_keluar' => 'required|date',
            'no_agenda' => 'required|string|max:255',
            'kode_surat' => 'required|string|max:255',
            'no_surat' => 'required|string|max:255',
            'tanggal_surat' => 'required|date',
            'kategori_id' => 'required|integer|exists:kategori_surats,id',
            'penerima' => 'required|string|max:255',
            'lampiran' => 'nullable|string|max:255',
            'berkas' => 'nullable|string|max:255',
        ]);

        // Masukkan user_id secara eksplisit ke data yang akan disimpan
        $validatedData['user_id'] = $user ? $user->id : null;

        // Logging data yang akan disimpan termasuk user_id
        \Log::info('Data surat keluar yang akan disimpan:', $validatedData);

        // Simpan data surat keluar
        $suratKeluar = SuratKeluar::create($validatedData);

        // Logging hasil simpan
        \Log::info('Surat keluar berhasil disimpan:', ['id' => $suratKeluar->id]);

        // Redirect atau response sesuai kebutuhan aplikasi
        return redirect()->route('surat-keluar.index')->with('success', 'Surat keluar berhasil disimpan!');
    }

    public function destroy($id)
    {
        $surat = SuratKeluar::findOrFail($id);

        // Optional: hapus file berkas
        if ($surat->berkas && Storage::exists('public/' . $surat->berkas)) {
            Storage::delete('public/' . $surat->berkas);
        }

        $surat->delete();

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $surat = SuratKeluar::findOrFail($id);

        $validated = $request->validate([
            'tanggal_surat_keluar' => 'required|date',
            'no_agenda' => 'required|string',
            'kode_surat' => 'required|string',
            'no_surat' => 'required|string',
            'tanggal_surat' => 'required|date',
            'kategori_id' => 'required|exists:kategori_surats,id',
            'penerima' => 'required|string',
            'lampiran' => 'nullable|string',
        ]);

        if ($request->hasFile('berkas')) {
            if ($surat->berkas && Storage::exists('public/' . $surat->berkas)) {
                Storage::delete('public/' . $surat->berkas);
            }
            $validated['berkas'] = $request->file('berkas')->store('surat-keluar', 'public');
        }

        $surat->update($validated);

        return redirect()->back();
    }

    public function show($id)
    {
        $surat = SuratKeluar::with('kategori')->findOrFail($id);
        return response()->json($surat);
    }
    public function periksa()
    {
        return $this->hasMany(PeriksaSuratKeluar::class);
    }



}
