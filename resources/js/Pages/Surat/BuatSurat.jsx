import React, { useState } from 'react';
import ModalPilihJenisSurat from '@/Components/ModalPilihJenisSurat';
import FormSuratTugas from '@/Components/FormSuratTugas';
import axios from 'axios';
import FormSuratKP from '@/Components/FormSuratKP';
import FormSuratDanaRaker from '@/Components/FormSuratDanaRaker';
import FormSKDekan from '@/Components/FormSKDekan';

export default function BuatSuratModal({ show, onClose, refreshData }) {
  const [jenisSurat, setJenisSurat] = useState(null);
  const [form, setForm] = useState({});

  // Handler perubahan input form
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Ketika user pilih jenis surat dari modal awal
  const handlePilihJenisSurat = (jenis) => {
    setJenisSurat(jenis);
    setForm({}); // reset form
  };

  // Submit form surat
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kirim data ke backend
      await axios.post('/api/surat-keluar', {
        jenis_surat: jenisSurat,
        ...form
      });
      alert('Surat berhasil dibuat dan disimpan.');
      onClose();
      setJenisSurat(null);
      setForm({});
      refreshData(); // Refresh tabel surat keluar di parent (kalau ada)
    } catch (error) {
      alert('Gagal membuat surat: ' + error.message);
    }
  };

  // Jika belum pilih jenis surat, tampilkan modal pilih jenis surat
  if (!jenisSurat) {
    return <ModalPilihJenisSurat show={show} onClose={onClose} onPilih={handlePilihJenisSurat} />;
  }

  // Tampilkan form sesuai jenis surat
  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center`}>
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Form {jenisSurat.replace('_', ' ').toUpperCase()}</h2>
        <form onSubmit={handleSubmit}>
          {jenisSurat === 'surat_tugas' && <FormSuratTugas form={form} onChange={handleChange} />}
          {jenisSurat === 'surat_kp' && <FormSuratKP form={form} onChange={handleChange} />}
          {jenisSurat === 'surat_danaraker' && <FormSuratDanaRaker form={form} onChange={handleChange} />}
          {jenisSurat === 'surat_dekan' && <FormSKDekan form={form} onChange={handleChange} />}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setJenisSurat(null);
                setForm({});
              }}
              className="px-4 py-2 border rounded"
            >
              Kembali
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Simpan dan Tutup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
