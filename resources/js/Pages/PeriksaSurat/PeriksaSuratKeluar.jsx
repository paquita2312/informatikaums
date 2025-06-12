import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PeriksaSuratKeluar({ periksaSuratKeluar, users }) {
  const { auth } = usePage().props;
  const [search, setSearch] = useState('');
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [suratKeluarStatus, setSuratKeluarStatus] = useState(periksaSuratKeluar);

  const filteredSurat = suratKeluarStatus.filter((s) =>
    s.surat_keluar.no_surat.toLowerCase().includes(search.toLowerCase()) ||
    s.surat_keluar.penerima.toLowerCase().includes(search.toLowerCase())
  );

    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const openAcceptModal = (surat) => {
        setSelectedSurat(surat);
        setShowAcceptModal(true);
    };

    const handleAcceptSurat = () => {
        if (!selectedSurat) return;

        router.post('/periksa-surat-keluar/terima', {
            surat_keluar_id: selectedSurat.surat_keluar.id,
            penerima_id: auth.user.id,
        }, {
            onSuccess: () => {
                setShowAcceptModal(false);
                // Update status surat jadi 'diterima'
                setSuratKeluarStatus(prevList =>
                    prevList.map(s =>
                        s.surat_keluar.id === selectedSurat.surat_keluar.id ? { ...s, status: 'diterima' } : s
                    )
                );
                setSelectedSurat(null);
            }
        });
    };

    const [showDisposisiModal, setShowDisposisiModal] = useState(false);
    const [disposisiForm, setDisposisiForm] = useState({
        tanggal_surat_keluar: '',
        tanggal_terima_surat: '',
        nomor_surat_keluar: '',
        tujuan_disposisi: '',
        asal_surat: '',
        perihal: '',
        sifat: '', // pilihan: penting, segera, rahasia, biasa
        tindakan: [], // checklist array
        catatan_disposisi: '',
    });
    const [selectedSuratForDisposisi, setSelectedSuratForDisposisi] = useState(null);

    const handleShowDisposisiPopup = (surat) => {
        setSelectedSuratForDisposisi(surat.surat_keluar);
        setDisposisiForm({
            tanggal_surat_keluar: surat.surat_keluar.tanggal_surat_keluar || '',
            tanggal_terima_surat: '', // kosong, user isi sendiri
            nomor_surat_keluar: surat.surat_keluar.nomor_surat || '',
            tujuan_disposisi: '',
            asal_surat: surat.surat_keluar.pengirim || '',
            perihal: surat.surat_keluar.perihal || '',
            sifat: '',
            tindakan: [],
            catatan_disposisi: '',
        });
        setShowDisposisiModal(true);
    };

    const handleKirimDisposisi = () => {
        if (!disposisiForm.tujuan_disposisi) {
            alert('Pilih tujuan disposisi terlebih dahulu');
            return;
        }
        router.post('/periksa-surat-keluar/disposisi', {
            surat_keluar_id: selectedSuratForDisposisi.id,
            pengirim_id: auth.user.id,
            penerima_id: disposisiForm.tujuan_disposisi,
            tanggal_surat_keluar: disposisiForm.tanggal_surat_keluar,
            tanggal_terima_surat: disposisiForm.tanggal_terima_surat,
            nomor_surat_keluar: disposisiForm.nomor_surat_keluar,
            asal_surat: disposisiForm.asal_surat,
            perihal: disposisiForm.perihal,
            sifat: disposisiForm.sifat,
            tindakan: disposisiForm.tindakan,
            catatan_disposisi: disposisiForm.catatan_disposisi,
        }, {
            onSuccess: () => {
            setShowDisposisiModal(false);
            setDisposisiForm({
                tanggal_surat_keluar: '',
                tanggal_terima_surat: '',
                nomor_surat_keluar: '',
                tujuan_disposisi: '',
                asal_surat: '',
                perihal: '',
                sifat: '',
                tindakan: [],
                catatan_disposisi: '',
            });
            setSuratKeluarStatus(prevList =>
                prevList.map(s =>
                    s.surat_keluar.id === selectedSuratForDisposisi.id ? { ...s, status: 'didisposisi' } : s
                )
            );
            setSelectedSuratForDisposisi(null);
            },
            onError: (errors) => {
                console.error("Terjadi kesalahan saat mengirim disposisi:", errors);
                alert("Gagal mengirim disposisi. Silakan periksa kembali isian form.");
            }
        });
    };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Periksa Surat Keluar</h2>}>
      <div className="p-6 bg-white rounded shadow">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Cari No. Surat atau Penerima..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-1 w-full max-w-md"
          />
        </div>

        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">No</th>
              <th className="border p-2">Tanggal Surat Keluar</th>
              <th className="border p-2">No. Surat</th>
              <th className="border p-2">Penerima</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Lampiran</th>
              <th className="border p-2">Berkas</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurat.map((s, i) => (
              <tr key={s.id}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{s.surat_keluar.tanggal_surat_keluar}</td>
                <td className="border p-2">{s.surat_keluar.no_surat}</td>
                <td className="border p-2">{s.surat_keluar.penerima}</td>
                <td className="border p-2">{s.surat_keluar.kategori?.nama}</td>
                <td className="border p-2">{s.surat_keluar.lampiran}</td>
                <td className="border p-2">
                  <a href={`/storage/${s.surat_keluar.berkas}`} target="_blank" className="text-blue-600 underline">
                    Lihat
                  </a>
                </td>
                <td className="border p-2">
                                    {s.status === 'diterima' || s.status === 'didisposisi' ? (
                                        // Jika sudah ada status, tampilkan tombol status saja
                                        <button
                                        className={`px-2 py-1 rounded text-sm ${
                                            s.status === 'diterima' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'
                                        }`}
                                        disabled
                                        >
                                        {s.status === 'diterima' ? 'Diterima' : 'Didisposisi'}
                                        </button>
                                    ) : (
                                        // Jika belum ada status, tampilkan tombol aksi
                                        <>
                                        <button
                                            onClick={() => openAcceptModal(s)}
                                            className="bg-blue-600 text-white px-2 py-1 rounded text-sm mr-2"
                                        >
                                            Terima
                                        </button>
                                        <button
                                            onClick={() => handleShowDisposisiPopup(s)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                                        >
                                            Disposisi
                                        </button>
                                        </>
                                    )}
                                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAcceptModal && selectedSurat && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow w-[400px]">
                        <h2 className="text-lg font-semibold mb-4">Apakah Anda menerima surat ini?</h2>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleAcceptSurat}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Iya
                            </button>
                            <button
                                onClick={() => setShowAcceptModal(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Tidak
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDisposisiModal && selectedSuratForDisposisi && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-[600px] rounded p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Disposisi Surat</h2>

                    <form
                        onSubmit={(e) => {
                        e.preventDefault();
                        handleKirimDisposisi();
                        }}
                    >
                        <div className="space-y-3 text-gray-800 text-sm">

                        <div>
                            <label className="block font-medium">Tanggal Surat Masuk</label>
                            <input
                            type="date"
                            className="border rounded w-full px-3 py-1"
                            value={disposisiForm.tanggal_surat_keluar}
                            onChange={(e) => setDisposisiForm({ ...disposisiForm, tanggal_surat_keluar: e.target.value })}
                            required
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Tanggal Terima Surat</label>
                            <input
                            type="date"
                            className="border rounded w-full px-3 py-1"
                            value={disposisiForm.tanggal_terima_surat}
                            onChange={(e) => setDisposisiForm({ ...disposisiForm, tanggal_terima_surat: e.target.value })}
                            required
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Nomor Surat Masuk</label>
                            <input
                            type="text"
                            className="border rounded w-full px-3 py-1"
                            value={disposisiForm.nomor_surat_keluar}
                            onChange={(e) => setDisposisiForm({ ...disposisiForm, nomor_surat_keluar: e.target.value })}
                            required
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Tujuan Disposisi</label>
                            <select
                            className="border rounded w-full px-3 py-1"
                            value={disposisiForm.tujuan_disposisi}
                            onChange={(e) => setDisposisiForm({ ...disposisiForm, tujuan_disposisi: e.target.value })}
                            required
                            >
                            <option value="">Pilih Tujuan</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                {user.name} ({user.role})
                                </option>
                            ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium">Asal Surat</label>
                            <input
                            type="text"
                            className="border rounded w-full px-3 py-1"
                            value={disposisiForm.asal_surat}
                            onChange={(e) => setDisposisiForm({ ...disposisiForm, asal_surat: e.target.value })}
                            required
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Perihal</label>
                            <input
                            type="text"
                            className="border rounded w-full px-3 py-1"
                            value={disposisiForm.perihal}
                            onChange={(e) => setDisposisiForm({ ...disposisiForm, perihal: e.target.value })}
                            required
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Sifat</label>
                            <select
                            className="border rounded w-full px-3 py-1"
                            value={disposisiForm.sifat}
                            onChange={(e) => setDisposisiForm({ ...disposisiForm, sifat: e.target.value })}
                            required
                            >
                            <option value="">Pilih Sifat</option>
                            <option value="penting">Penting</option>
                            <option value="segera">Segera</option>
                            <option value="rahasia">Rahasia</option>
                            <option value="biasa">Biasa</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium">Tindakan</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                            {['Tinjau', 'Setujui', 'Tolak', 'Tindak Lanjut'].map((tindakan) => (
                                <label key={tindakan} className="inline-flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    checked={disposisiForm.tindakan.includes(tindakan)}
                                    onChange={(e) => {
                                    if (e.target.checked) {
                                        setDisposisiForm({
                                        ...disposisiForm,
                                        tindakan: [...disposisiForm.tindakan, tindakan],
                                        });
                                    } else {
                                        setDisposisiForm({
                                        ...disposisiForm,
                                        tindakan: disposisiForm.tindakan.filter((t) => t !== tindakan),
                                        });
                                    }
                                    }}
                                />
                                <span>{tindakan}</span>
                                </label>
                            ))}
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">Catatan Disposisi</label>
                            <textarea
                            className="border rounded w-full px-3 py-1"
                            rows={3}
                            value={disposisiForm.catatan_disposisi}
                            onChange={(e) => setDisposisiForm({ ...disposisiForm, catatan_disposisi: e.target.value })}
                            />
                        </div>

                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Kirim
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDisposisiModal(false)}
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                        >
                            Tutup
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            )}
    </AuthenticatedLayout>
  );
}
