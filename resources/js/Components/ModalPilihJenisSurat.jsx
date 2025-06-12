import React, { useState } from 'react';

export default function ModalPilihJenisSurat({ show, onClose, onPilih }) {
  const [jenisSurat, setJenisSurat] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jenisSurat) {
      onPilih(jenisSurat);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Pilih Jenis Surat</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={jenisSurat}
            onChange={(e) => setJenisSurat(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mb-4"
            required
          >
            <option value="">-- Pilih Jenis Surat --</option>
            <option value="surat_tugas">Surat Tugas</option>
            <option value="surat_kp">Surat KP</option>
            <option value="surat_danaraker">Surat Dana Raker</option>
            <option value="surat_dekan">Surat SK  Dekan</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Buat Surat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
