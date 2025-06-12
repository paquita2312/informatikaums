<?php

namespace App\Http\Controllers;

use App\Models\SKDekan;
use App\Models\DaftarWali;
use App\Models\MahasiswaWali;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\SuratKeluar;
use Illuminate\Support\Facades\Response;

class SKDekanController extends Controller
{
    public function create()
    {
        return view('surat_sk_dekan.create');
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Data diterima:', $request->all());

            $validated = $request->validate([
                'nomor_surat' => 'required',
                'tahun_akademik' => 'required',
                'prodi' => 'required',
                'kota' => 'required',
                'tanggal_ttd' => 'required|date',
                'tembusan' => 'nullable',
                'daftar' => 'required|array',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        // Siapkan variabel untuk file path
        $fileName = '';
        $filePath = '';

        DB::beginTransaction();
        try {
            // 1. Simpan data utama
            $sk = SKDekan::create($validated);

            foreach ($validated['daftar'] as $dosen) {
                $wali = DaftarWali::create([
                    'sk_dekan_id' => $sk->id,
                    'nama_dosen' => $dosen['nama_dosen'],
                ]);

                foreach ($dosen['mahasiswa'] as $mhs) {
                    MahasiswaWali::create([
                        'daftar_wali_id' => $wali->id,
                        'nim' => $mhs['nim'],
                        'nama_mahasiswa' => $mhs['nama_mahasiswa'],
                    ]);
                }
            }

            // 2. Siapkan isi dokumen
            $rows = [];
            $no = 1;
            foreach ($validated['daftar'] as $dosen) {
                foreach ($dosen['mahasiswa'] as $mhs) {
                    $rows[] = [
                        'no' => $no++,
                        'nama_dosen' => $dosen['nama_dosen'],
                        'nim' => $mhs['nim'],
                        'nama_mahasiswa' => $mhs['nama_mahasiswa'],
                    ];
                }
            }

            $templatePath = storage_path('app/templates/surat_sk_dekan_template.docx');
            if (!file_exists($templatePath)) {
                throw new \Exception('Template surat SK Dekan tidak ditemukan');
            }

            $templateProcessor = new TemplateProcessor($templatePath);
            $templateProcessor->setValue('nomor_surat', $sk->nomor_surat);
            $templateProcessor->setValue('tahun_akademik', $sk->tahun_akademik);
            $templateProcessor->setValue('prodi', $sk->prodi);
            $templateProcessor->setValue('kota', $sk->kota);
            $templateProcessor->setValue('tanggal_ttd', Carbon::parse($sk->tanggal_ttd)->translatedFormat('d F Y'));
            $templateProcessor->setValue('tembusan', $sk->tembusan ?? '-');

            $templateProcessor->cloneRow('nim', count($rows));
            foreach ($rows as $index => $row) {
                $i = $index + 1;
                $templateProcessor->setValue("no#{$i}", $row['no']);
                $templateProcessor->setValue("nama_dosen#{$i}", $row['nama_dosen']);
                $templateProcessor->setValue("nim#{$i}", $row['nim']);
                $templateProcessor->setValue("nama_mahasiswa#{$i}", $row['nama_mahasiswa']);
            }

            // 3. Simpan file Word
            $fileName = 'sk_dekan_' . $sk->id . '_' . '.docx';
            $filePath = storage_path('app/public/surat-keluar/' . $fileName);
            $templateProcessor->saveAs($filePath);
            $berkasPath = 'surat-keluar/' . $fileName;

            // 4. Simpan ke tabel surat_keluar
            SuratKeluar::create([
                'tanggal_surat_keluar' => now(),
                'no_agenda' => 'SKD-' . $sk->id,
                'kode_surat' => 'SKD',
                'no_surat' => $sk->nomor_surat,
                'tanggal_surat' => $sk->tanggal_ttd,
                'kategori_id' => 6,
                'penerima' => $sk->prodi,
                'lampiran' => '-',
                'berkas' => $berkasPath,
            ]);

            DB::commit();

            // 5. Return response download
            return response()->download($filePath);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Gagal menyimpan SK Dekan: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan surat',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
