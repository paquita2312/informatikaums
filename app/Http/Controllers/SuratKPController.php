<?php

namespace App\Http\Controllers;

use App\Models\SuratKP;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;
use App\Models\SuratKeluar;

class SuratKPController extends Controller
{
    public function create()
    {
        return view('surat_kp.create');
    }

    public function store(Request $request)
    {
        // Validasi data
        $validated = $request->validate([
            'tanggal_surat' => 'required|date',
            'nomor_surat' => 'required|string|max:255',
            'lampiran' => 'nullable|string|max:255',
            'perihal_surat' => 'required|string|max:255',
            'tujuan_surat' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'kegiatan' => 'required|string|max:255',
            'prodi' => 'required|string',
            'nama_surat' => 'required|string|max:255',
            'perusahaan' => 'required|string|max:255',
            'mahasiswa' => 'required|string|max:255',
            'nim' => 'required|string|max:255',
            'tembusan' => 'nullable|string|max:255',

        ]);

        $surat = SuratKP::create($validated);

        $templatePath = storage_path('app/templates/surat_pengantar_kp_template.docx');
        if (!file_exists($templatePath)) {
            Log::error("Template file not found: " . $templatePath);
            abort(500, 'Template file tidak ditemukan');
        }
        $templateProcessor = new TemplateProcessor($templatePath);

        $templateProcessor->setValue('tanggal_surat', Carbon::parse($surat->tanggal_surat)->format('d-m-Y'));
        $templateProcessor->setValue('nomor_surat', $surat->nomor_surat);
        $templateProcessor->setValue('lampiran', $surat->lampiran);
        $templateProcessor->setValue('perihal_surat', $surat->perihal_surat);
        $templateProcessor->setValue('tujuan_surat', $surat->tujuan_surat);
        $templateProcessor->setValue('alamat', $surat->alamat);
        $templateProcessor->setValue('kegiatan', $surat->kegiatan);
        $templateProcessor->setValue('prodi', $surat->prodi);
        $templateProcessor->setValue('nama_surat', $surat->nama_surat);
        $templateProcessor->setValue('perusahaan', $surat->perusahaan);
        $templateProcessor->setValue('mahasiswa', $surat->mahasiswa);
        $templateProcessor->setValue('nim', $surat->nim);
        $templateProcessor->setValue('tembusan', $surat->tembusan ?? '-');

        $saveDir = storage_path('app/public/surat-keluar');
        if (!file_exists($saveDir)) {
            mkdir($saveDir, 0777, true);
        }

        $fileName = 'surat_pengantar_kp_' . $surat->id . '.docx';
        $savePath = $saveDir . '/' . $fileName;
        $templateProcessor->saveAs($savePath);

        SuratKeluar::create([
            'tanggal_surat_keluar' => now(),
            'no_agenda' => 'ST-' . $surat->id, // contoh auto
            'kode_surat' => 'ST',
            'no_surat' => $surat->nomor_surat,
            'tanggal_surat' => $surat->tanggal_surat,
            'kategori_id' => 4, // misalnya ST = Surat Tugas
            'penerima' => $surat->tujuan_surat,
            'lampiran' => '-',
            'berkas' => 'surat-keluar/' . $fileName,
        ]);

       return response()->download($savePath);
    }
}
