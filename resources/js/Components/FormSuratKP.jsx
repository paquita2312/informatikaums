import React from 'react';
import axios from 'axios';

export default function FormSuratKP({ form, onChange }) {
    const handleSubmit = async () => {
        try {
            const response = await axios.post('/surat-kp', form, {
            responseType: 'blob',
            withCredentials: true,
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'Surat_KP.docx';
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Gagal mengirim form:', error);
            alert('Gagal mengirim form, silakan coba lagi.');
        }
    };
  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-bold mb-4">Form Surat Pengantar Kerja Praktek</h3>
      <div className="mb-2">
        <label className="block text-sm">Tanggal Surat (Masehi)</label>
        <input type="date" name="tanggal_surat" value={form.tanggal_surat || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Nomor Surat</label>
        <input type="text" name="nomor_surat" value={form.nomor_surat || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Lampiran</label>
        <input type="text" name="lampiran" value={form.lampiran || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Perihal</label>
        <input type="text" name="perihal_surat" value={form.perihal_surat || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Kepada Yth</label>
        <input type="text" name="tujuan_surat" value={form.tujuan_surat || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Alamat Perusahaan</label>
        <input type="text" name="alamat" value={form.alamat || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Nama Kegiatan</label>
        <textarea name="kegiatan" value={form.kegiatan || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Nama Prodi</label>
        <input type="text" name="prodi" value={form.prodi || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Nama Surat</label>
        <input type="text" name="nama_surat" value={form.nama_surat || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Nama Perusahaan</label>
        <input type="text" name="perusahaan" value={form.perusahaan|| ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Nama Mahasiswa</label>
        <input type="text" name="mahasiswa" value={form.mahasiswa || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">NIM</label>
        <input type="text" name="nim" value={form.nim || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Tembusan</label>
        <input type="text" name="tembusan" value={form.tembusan || ''} onChange={onChange} className="w-full border px-2 py-1" />
      </div>
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">
            Simpan & Unduh Surat
         </button>
    </div>
  );
}
