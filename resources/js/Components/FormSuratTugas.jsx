import React from 'react';
import axios from 'axios';

export default function FormSuratTugas({ form, onChange }) {

const handleSubmit = async () => {
  try {
    const response = await axios.post('/surat-tugas', form, {
      responseType: 'blob', // penting untuk download file
       withCredentials: true,
    });

    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Surat_Tugas.docx';
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Gagal mengirim form:', error);
    alert('Gagal mengirim form, silakan coba lagi.');
  }
};


  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-bold mb-4">Form Surat Tugas</h3>
      <div className="mb-2">
        <label className="block text-sm">Nomor Surat</label>
        <input type="text" name="nomor_surat" value={form.nomor_surat || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Nama Pemberi Tugas</label>
        <input type="text" name="pemberi_nama" value={form.pemberi_nama || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Jabatan Pemberi</label>
        <input type="text" name="pemberi_jabatan" value={form.pemberi_jabatan || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Nama Penerima Tugas</label>
        <input type="text" name="penerima_nama" value={form.penerima_nama || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Jabatan Penerima</label>
        <input type="text" name="penerima_jabatan" value={form.penerima_jabatan || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Nama Acara</label>
        <textarea name="kegiatan" value={form.kegiatan || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Penyelenggara Acara</label>
        <input type="text" name="penyelenggara_acara" value={form.penyelenggara_acara || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Hari Acara</label>
        <input type="text" name="hari_acara" value={form.hari_acara || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Tanggal Acara</label>
        <input type="date" name="tanggal_acara" value={form.tanggal_acara || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Tempat Acara</label>
        <input type="text" name="tempat_acara" value={form.tempat_acara || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Tanggal Surat (Masehi)</label>
        <input type="date" name="tanggal_surat_kegiatan" value={form.tanggal_surat_kegiatan || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Lampiran</label>
        <input type="text" name="tembusan" value={form.tembusan || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">
            Simpan & Unduh Surat
        </button>
    </div>
  );
}
