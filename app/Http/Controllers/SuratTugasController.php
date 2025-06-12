<?php

namespace App\Http\Controllers;

use App\Models\SuratTugas;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;
use App\Models\SuratKeluar;

class SuratTugasController extends Controller
{
    public function create()
    {
        return view('surat_tugas.create');
    }

    public function store(Request $request)
    {
        // Validasi data
        $validated = $request->validate([
            'nomor_surat' => 'required|string|max:255',
            'pemberi_nama' => 'required|string|max:255',
            'pemberi_jabatan' => 'required|string|max:255',
            'penerima_nama' => 'required|string|max:255',
            'penerima_jabatan' => 'required|string|max:255',
            'kegiatan' => 'required|string',
            'penyelenggara_acara' => 'required|string|max:255',
            'hari_acara' => 'required|string|max:255',
            'tanggal_acara' => 'required|date',
            'tempat_acara' => 'required|string|max:255',
            'tanggal_surat_kegiatan' => 'required|date',
            'tembusan' => 'nullable|string|max:255',
        ]);

        $surat = SuratTugas::create($validated);

        $templatePath = storage_path('app/templates/surat_tugas_template.docx'); // sesuaikan path template
        if (!file_exists($templatePath)) {
            Log::error("Template file not found: " . $templatePath);
            abort(500, 'Template file tidak ditemukan');
        }
        $templateProcessor = new TemplateProcessor($templatePath);

        $templateProcessor->setValue('nomor_surat', $surat->nomor_surat);
        $templateProcessor->setValue('pemberi_nama', $surat->pemberi_nama);
        $templateProcessor->setValue('pemberi_jabatan', $surat->pemberi_jabatan);
        $templateProcessor->setValue('penerima_nama', $surat->penerima_nama);
        $templateProcessor->setValue('penerima_jabatan', $surat->penerima_jabatan);
        $templateProcessor->setValue('kegiatan', $surat->kegiatan);
        $templateProcessor->setValue('penyelenggara_acara', $surat->penyelenggara_acara);
        $templateProcessor->setValue('hari_acara', $surat->hari_acara);
        $templateProcessor->setValue('tanggal_acara', Carbon::parse($surat->tanggal_acara)->format('d-m-Y'));
        $templateProcessor->setValue('tempat_acara', $surat->tempat_acara);
        $templateProcessor->setValue('tanggal_surat_kegiatan', Carbon::parse($surat->tanggal_surat_kegiatan)->format('d-m-Y'));
        $templateProcessor->setValue('tembusan', $surat->tembusan ?? '-');

        $saveDir = storage_path('app/public/surat-keluar');
        if (!file_exists($saveDir)) {
            mkdir($saveDir, 0777, true);
        }

        $fileName = 'surat_keluar_' . $surat->id . '.docx';
        $savePath = $saveDir . '/' . $fileName;
        $templateProcessor->saveAs($savePath);

        SuratKeluar::create([
            'tanggal_surat_keluar' => now(),
            'no_agenda' => 'ST-' . $surat->id, // contoh auto
            'kode_surat' => 'ST',
            'no_surat' => $surat->nomor_surat,
            'tanggal_surat' => $surat->tanggal_surat_kegiatan,
            'kategori_id' => 3, // misalnya ST = Surat Tugas
            'penerima' => $surat->penerima_nama,
            'lampiran' => '-',
            'berkas' => 'surat-keluar/' . $fileName,
        ]);

       return response()->download($savePath);
    }
}
