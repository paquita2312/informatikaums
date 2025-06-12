import React, { useState } from 'react';
import axios from 'axios';

export default function FormSuratDanaRaker() {
  const [data, setData] = useState({
    tanggal_surat:'',
    nomor_surat:'',
    lampiran:'',
    perihal_surat:'',
    tujuan_surat:'',
    agenda:'',
    hari_acara:'',
    tanggal_acara:'',
    keterangan:'',
    kegiatan:'',
    nominal:'',
    tembusan:'',
  });

  const [rows, setRows] = useState([
    { uraian: '', unit: 0, harga: 0, children: [] }
  ]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addRow = () => {
    setRows([...rows, { uraian: '', unit: 0, harga: 0, children: [] }]);
  };

  const addChild = (i) => {
    const updated = [...rows];
    updated[i].children.push({ uraian: '', unit: 0, harga: 0 });
    setRows(updated);
  };

  const onRowChange = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;
    setRows(updated);
  };

  const onChildChange = (i, j, field, value) => {
    const updated = [...rows];
    updated[i].children[j][field] = value;
    setRows(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...data, rows };
      const response = await axios.post('/surat-danaraker', payload, {
        withCredentials: true,
      });

      const fileUrl = response.data.file_url;
      alert('Data berhasil disimpan!');
      // Buka file Word di tab baru
    if (response.data.file_url) {
      window.open(response.data.file_url, '_blank');
    }

      setData({
        tanggal_surat:'',
        nomor_surat:'',
        lampiran:'',
        perihal_surat:'',
        tujuan_surat:'',
        agenda:'',
        hari_acara:'',
        tanggal_acara:'',
        keterangan:'',
        kegiatan:'',
        nominal:'',
        tembusan:'',
      });
      setRows([{ uraian: '', unit: 0, harga: 0, children: [] }]);
    } catch (error) {
      console.error('Gagal mengirim data:', error);
      alert('Gagal menyimpan, periksa input dan coba lagi.');
    }
  };

  return (
    <div onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="mt-4 border-t pt-4">
        <h3 className="text-lg font-bold mb-4">Form Surat Dana Rakernas</h3>

        <div className="mb-2">
          <label className="block text-sm">Tanggal Surat</label>
          <input type="date" name="tanggal_surat" value={data.tanggal_surat || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Nomor Surat</label>
          <input type="text" name="nomor_surat" value={data.nomor_surat || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Lampiran</label>
          <input type="text" name="lampiran" value={data.lampiran || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Perihal</label>
          <input type="text" name="perihal_surat" value={data.perihal_surat || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Kepada Yth</label>
          <input type="text" name="tujuan_surat" value={data.tujuan_surat || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Nama Agenda</label>
          <textarea name="agenda" value={data.agenda || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Hari Acara</label>
          <input type="text" name="hari_acara" value={data.hari_acara || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Tanggal Acara</label>
          <input type="date" name="tanggal_acara" value={data.tanggal_acara || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Keterangan</label>
          <input type="text" name="keterangan" value={data.keterangan || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Nama Kegiatan</label>
          <textarea name="kegiatan" value={data.kegiatan || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Nominal</label>
          <textarea name="nominal" value={data.nominal || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Tembusan</label>
          <input type="text" name="tembusan" value={data.tembusan || ''} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
      </div>

      {/* RINCIAN ANGGARAN */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-bold mb-4">Rincian Anggaran</h3>

        {rows.map((row, i) => (
          <div key={i} className="mb-4 p-2 border bg-gray-50 rounded">
            <div className="flex gap-2 mb-2">
              <input
                className="w-full border px-2 py-1"
                placeholder="Uraian"
                value={row.uraian}
                onChange={(e) => onRowChange(i, 'uraian', e.target.value)}
              />
              <input
                type="number"
                className="w-20 border px-2 py-1"
                placeholder="Unit"
                value={row.unit}
                onChange={(e) => onRowChange(i, 'unit', parseInt(e.target.value))}
              />
              <input
                type="number"
                className="w-28 border px-2 py-1"
                placeholder="Harga"
                value={row.harga}
                onChange={(e) => onRowChange(i, 'harga', parseInt(e.target.value))}
              />
              <span className="w-28 text-right font-semibold px-2 py-1">
                Rp {(row.unit * row.harga).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="pl-6">
              {row.children.map((child, j) => (
                <div key={j} className="flex gap-2 mb-2">
                  <input
                    className="w-full border px-2 py-1"
                    placeholder="Sub-Uraian"
                    value={child.uraian}
                    onChange={(e) => onChildChange(i, j, 'uraian', e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-20 border px-2 py-1"
                    placeholder="Unit"
                    value={child.unit}
                    onChange={(e) => onChildChange(i, j, 'unit', parseInt(e.target.value))}
                  />
                  <input
                    type="number"
                    className="w-28 border px-2 py-1"
                    placeholder="Harga"
                    value={child.harga}
                    onChange={(e) => onChildChange(i, j, 'harga', parseInt(e.target.value))}
                  />
                  <span className="w-28 text-right font-semibold px-2 py-1">
                    Rp {(child.unit * child.harga).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
              <button type="button" onClick={() => addChild(i)} className="text-blue-600 text-sm mt-1">
                + Tambah Sub-Uraian
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={addRow} className="bg-green-600 text-white px-3 py-1 rounded">
          + Tambah Uraian
        </button>
      </div>

      <div className="mt-4 flex justify-end">
        <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        >
            Simpan & Generate Surat
        </button>
      </div>
    </div>
  );
}
