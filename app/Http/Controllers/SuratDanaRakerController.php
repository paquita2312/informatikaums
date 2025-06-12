<?php
namespace App\Http\Controllers;

use App\Models\SuratDanaRaker;
use App\Models\AnggaranRaker;
use App\Models\SuratKeluar;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SuratDanaRakerController extends Controller
{
    public function create()
    {
        return view('surat_danaraker.create');
    }

    public function store(Request $request)
    {
        \Log::info('Request body', $request->all());
        $validated = $request->validate([
            'tanggal_surat' => 'required|date',
            'nomor_surat' => 'required|string|max:255',
            'perihal_surat' => 'required|string|max:255',
            'tujuan_surat' => 'required|string|max:255',
            'agenda' => 'required|string|max:255',
            'hari_acara' => 'required|string|max:255',
            'tanggal_acara' => 'required|date',
            'keterangan' => 'required|string|max:255',
            'kegiatan' => 'required|string|max:255',
            'nominal' => 'required|string|max:255',
            'lampiran' => 'nullable|string|max:255',
            'tembusan' => 'nullable|string|max:255',
            'rows' => 'required|array',
        ]);

        $rows = $request->input('rows', []);

        DB::beginTransaction();
        try {
            // 1. Simpan surat utama
            $surat = SuratDanaRaker::create($validated);

            // 2. Simpan rincian anggaran
            foreach ($rows as $row) {
                $parent = AnggaranRaker::create([
                    'surat_dana_raker_id' => $surat->id,
                    'uraian' => $row['uraian'],
                    'unit' => $row['unit'],
                    'harga' => $row['harga'],
                    'parent_id' => null,
                ]);

                foreach ($row['children'] ?? [] as $child) {
                    AnggaranRaker::create([
                        'surat_dana_raker_id' => $surat->id,
                        'uraian' => $child['uraian'],
                        'unit' => $child['unit'],
                        'harga' => $child['harga'],
                        'parent_id' => $parent->id,
                    ]);
                }
            }

            // 3. Generate Word
            $templatePath = storage_path('app/templates/surat_dana_raker_template.docx');
            if (!file_exists($templatePath)) {
                return response()->json(['error' => 'Template file not found'], 500);
            }
            $templateProcessor = new TemplateProcessor($templatePath);

            $templateProcessor->setValue('tanggal_surat', Carbon::parse($validated['tanggal_surat'])->format('d F Y'));
            $templateProcessor->setValue('nomor_surat', $validated['nomor_surat']);
            $templateProcessor->setValue('perihal_surat', $validated['perihal_surat']);
            $templateProcessor->setValue('tujuan_surat', $validated['tujuan_surat']);
            $templateProcessor->setValue('agenda', $validated['agenda']);
            $templateProcessor->setValue('hari_acara', $validated['hari_acara']);
            $templateProcessor->setValue('tanggal_acara', Carbon::parse($validated['tanggal_acara'])->format('d F Y'));
            $templateProcessor->setValue('keterangan', $validated['keterangan']);
            $templateProcessor->setValue('kegiatan', $validated['kegiatan']);
            $templateProcessor->setValue('nominal', $validated['nominal']);
            $templateProcessor->setValue('lampiran', $validated['lampiran'] ?? '-');
            $templateProcessor->setValue('tembusan', $validated['tembusan'] ?? '-');

            // 4. Anggaran ke Word
            $anggaranList = [];
            $no = 1;

            foreach ($rows as $row) {
                $total = $row['unit'] * $row['harga'];
                $anggaranList[] = [
                    'anggaran_uraian' => $row['uraian'],
                    'anggaran_unit' => $row['unit'],
                    'anggaran_harga' => number_format($row['harga'], 0, ',', '.'),
                    'anggaran_jumlah' => number_format($total, 0, ',', '.'),
                ];

                foreach ($row['children'] ?? [] as $child) {
                    $totalChild = $child['unit'] * $child['harga'];
                    $anggaranList[] = [
                        'anggaran_uraian' => '- ' . $child['uraian'],
                        'anggaran_unit' => $child['unit'],
                        'anggaran_harga' => number_format($child['harga'], 0, ',', '.'),
                        'anggaran_jumlah' => number_format($totalChild, 0, ',', '.'),
                    ];
                }
            }

            $templateProcessor->cloneRowAndSetValues('anggaran_uraian', $anggaranList);

            // 5. Simpan file
            $fileName = 'surat_dana_raker_' . Str::random(6) . '.docx';
            $savePath = storage_path('app/public/surat-keluar/' . $fileName);
            $templateProcessor->saveAs($savePath);
            $berkasPath = 'surat-keluar/' . $fileName;

            // 6. Simpan ke surat_keluar
            SuratKeluar::create([
                'tanggal_surat_keluar' => now(),
                'no_agenda' => 'SDKR-' . now()->timestamp,
                'kode_surat' => 'SDKR',
                'no_surat' => $validated['nomor_surat'],
                'tanggal_surat' => $validated['tanggal_surat'],
                'kategori_id' => 5,
                'penerima' => $validated['tujuan_surat'],
                'lampiran' => $validated['lampiran'] ?? '-',
                'berkas' => $berkasPath,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Surat berhasil disimpan',
                'file_url' => asset('storage/' . $berkasPath),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error saat menyimpan Surat Dana Raker', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Surat berhasil disimpan',
                'file_url' => asset('storage/' . $berkasPath),
            ]);
        }
    }
}
