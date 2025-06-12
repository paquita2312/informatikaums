import React, { useState } from 'react';
import axios from 'axios';

export default function FormSKDekan() {
  const [data, setData] = useState({
    nomor_surat: '',
    tahun_akademik: '',
    prodi: '',
    kota: '',
    tanggal_ttd: '',
    tembusan: '',
  });

  const [daftar, setDaftar] = useState([
    {
      nama_dosen: '',
      mahasiswa: [{ nim: '', nama_mahasiswa: '' }],
    },
  ]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDosenChange = (i, value) => {
    const updated = [...daftar];
    updated[i].nama_dosen = value;
    setDaftar(updated);
  };

  const handleMahasiswaChange = (i, j, field, value) => {
    const updated = [...daftar];
    updated[i].mahasiswa[j][field] = value;
    setDaftar(updated);
  };

  const tambahDosen = () => {
    setDaftar([...daftar, { nama_dosen: '', mahasiswa: [{ nim: '', nama_mahasiswa: '' }] }]);
  };

  const tambahMahasiswa = (i) => {
    const updated = [...daftar];
    updated[i].mahasiswa.push({ nim: '', nama_mahasiswa: '' });
    setDaftar(updated);
  };


  const handleSubmit = async () => {
    try {
      const payload = { ...data, daftar };
      const response = await axios.post('/sk-dekan', payload, {
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sk_dekan.docx'); // nama file download
        document.body.appendChild(link);
        link.click();
        link.remove();

      alert('Data berhasil disimpan!');

      setData({
        nomor_surat: '',
        tahun_akademik: '',
        prodi: '',
        kota: '',
        tanggal_ttd: '',
        tembusan: '',
      });
      setDaftar([{ nama_dosen: '', mahasiswa: [{ nim: '', nama_mahasiswa: '' }] }]);
    } catch (error) {
      console.error('Gagal mengirim data:', error);
      alert('Gagal menyimpan, periksa input dan coba lagi.');
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Form Surat Keputusan Dosen Wali</h2>

      <div className="mb-2">
        <label className="block text-sm">Nomor Surat</label>
        <input
          name="nomor_surat"
          value={data.nomor_surat}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Tahun Akademik</label>
        <input
          name="tahun_akademik"
          value={data.tahun_akademik}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Prodi</label>
        <input name="prodi" value={data.prodi} onChange={handleChange} className="w-full border px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Kota</label>
        <input type="text" name="kota" value={data.kota} onChange={handleChange} className="w-full border px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Tanggal (Masehi)</label>
        <input
          type="date"
          name="tanggal_ttd"
          value={data.tanggal_ttd}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Tembusan</label>
        <input
          type="text"
          name="tembusan"
          value={data.tembusan}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </div>

      <hr className="my-4" />

      <h3 className="text-md font-semibold mb-2">Lampiran: Daftar Dosen & Mahasiswa</h3>
      {daftar.map((dosen, i) => (
        <div key={i} className="mb-4 p-3 border rounded bg-gray-50">
          <input
            placeholder="Nama Dosen"
            value={dosen.nama_dosen}
            onChange={(e) => handleDosenChange(i, e.target.value)}
            className="border px-2 py-1 w-full mb-2 font-semibold"
          />

          {dosen.mahasiswa.map((mhs, j) => (
            <div key={j} className="grid grid-cols-2 gap-2 mb-2">
              <input
                placeholder="NIM Mahasiswa"
                value={mhs.nim}
                onChange={(e) => handleMahasiswaChange(i, j, 'nim', e.target.value)}
                className="border px-2 py-1"
              />
              <input
                placeholder="Nama Mahasiswa"
                value={mhs.nama_mahasiswa}
                onChange={(e) => handleMahasiswaChange(i, j, 'nama_mahasiswa', e.target.value)}
                className="border px-2 py-1"
              />
            </div>
          ))}

          <button type="button" onClick={() => tambahMahasiswa(i)} className="text-blue-600 text-sm mt-1">
            + Tambah Mahasiswa
          </button>
        </div>
      ))}

      <button type="button" onClick={tambahDosen} className="text-green-600 text-sm mt-2">
        + Tambah Dosen
      </button>

      <div className="mt-6">
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
          Simpan & Generate Surat
        </button>
      </div>
    </div>
  );
}
