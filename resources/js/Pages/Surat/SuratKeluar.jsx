import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ModalPilihJenisSurat from '@/Components/ModalPilihJenisSurat';
import FormSuratTugas from '@/Components/FormSuratTugas';
import FormSuratKP from '@/Components/FormSuratKP';
import FormSKDekan from '@/Components/FormSKDekan';
import FormSuratDanaRaker from '@/Components/FormSuratDanaRaker';

export default function SuratKeluar() {
    const [showJenisSuratModal, setShowJenisSuratModal] = useState(false);
    const [jenisSuratDipilih, setJenisSuratDipilih] = useState(null);
    const handlePilihJenisSurat = (jenis) => {
        setJenisSuratDipilih(jenis);
    };

    const { suratKeluar, kategoriSurat, suratTerkirim, users} = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        tanggal_surat_keluar: '',
        no_agenda: '',
        kode_surat: '',
        no_surat: '',
        tanggal_surat: '',
        kategori_id: '',
        penerima: '',
        lampiran: '',
        berkas: null,
    });

    console.log("suratKeluar:", suratKeluar);

    const [searchKeluar, setSearchKeluar] = useState('');
    const [searchTerkirim, setSearchTerkirim] = useState('');

    const filteredSuratKeluar = suratKeluar.filter((item) =>
        item.no_agenda.toLowerCase().includes(searchKeluar.toLowerCase()) ||
        item.pengirim.toLowerCase().includes(searchKeluar.toLowerCase())
    );

    const filteredSuratTerkirim = suratTerkirim.filter((item) =>
        item.no_agenda.toLowerCase().includes(searchTerkirim.toLowerCase()) ||
        item.pengirim.toLowerCase().includes(searchTerkirim.toLowerCase())
    );

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach((key) => data.append(key, form[key]));

        if (editMode) {
            router.post(`/surat-keluar/${editId}`, {
            _method: 'put',
            ...form,
            }, {
            onSuccess: () => {
                resetForm();
            },
            });
        } else {
            router.post('/surat-keluar', data, {
                forceFormData: true,
                onSuccess: () => {
                    resetForm();
                },
            });
        }
    };

    const resetForm = () => {
        setForm({
            tanggal_surat_keluar: '',
            no_agenda: '',
            kode_surat: '',
            no_surat: '',
            tanggal_surat: '',
            kategori_id: '',
            penerima: '',
            lampiran: '',
            berkas: null,
        });
        setEditMode(false);
        setEditId(null);
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus surat ini?')) {
            router.delete(`/surat-keluar/${id}`);
        }
    };

    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const handleEdit = (item) => {
        setForm({
            tanggal_surat_keluar: item.tanggal_surat_keluar,
            no_agenda: item.no_agenda,
            kode_surat: item.kode_surat,
            no_surat: item.no_surat,
            tanggal_surat: item.tanggal_surat,
            kategori_id: item.kategori_id,
            penerima: item.penerima,
            lampiran: item.lampiran,
            berkas: null, // Optional: kosongkan biar user bisa upload baru
        });
        setEditMode(true);
        setEditId(item.id);
        setShowModal(true);
    };

    const [selectedSuratKeluar, setSelectedSuratKeluar] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const handleView = (item) => {
        setSelectedSuratKeluar(item);
        setShowViewModal(true);
    };


    const [receiverEmail, setReceiverEmail] = useState("");
    const handleKirim = () => {
        if (!receiverEmail) {
            alert('Pilih penerima terlebih dahulu.');
            return;
        }

        router.post('/periksa-surat-keluar', {
            surat_keluar_id: selectedSuratKeluar.id,
            penerima_id: receiverEmail,
        }, {
            onSuccess: () => {
                setReceiverEmail('');
                setShowViewModal(false);
            }
        });
    };



  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Surat Keluar</h2>}>
        <div className="p-6 bg-white rounded shadow">
            <div className="flex justify-between mb-4">
                <input type="text" placeholder="Cari..." value={searchKeluar} onChange={e => setSearchKeluar(e.target.value)} className="border rounded px-3 py-1" />
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Tambah Data</button>
            </div>
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Tanggal Surat Keluar</th>
                    <th className="p-2 border">No Agenda</th>
                    <th className="p-2 border">Nomor Surat</th>
                    <th className="p-2 border">Tgl Keluar</th>
                    <th className="p-2 border">Tujuan Surat</th>
                    <th className="p-2 border">Berkas</th>
                    <th className="p-2 border">Action</th>
                </tr>
                </thead>
                <tbody>
                {filteredSuratKeluar?.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{item.tanggal_surat_keluar}</td>
                    <td className="p-2 border">{item.no_agenda}</td>
                    <td className="p-2 border">{item.no_surat}</td>
                    <td className="p-2 border">{item.tanggal_surat}</td>
                    <td className="p-2 border">{item.penerima}</td>
                    <td className="p-2 border">
                        <a
                        href={`/storage/${item.berkas}`}
                        target="_blank"
                        className="text-blue-600 underline"
                        >
                        Lihat Berkas
                        </a>
                    </td>
                    <td className="p-2 border space-x-2">
                        <button
                            onClick={() => handleView(item)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                            View
                        </button>
                        <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                            Hapus
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h2 className="text-xl font-bold mt-8 mb-2">Surat Sudah Dikirim / Diperiksa</h2>
                <input
                    type="text"
                    placeholder="Cari berdasarkan no agenda atau pengirim..."
                    value={searchTerkirim}
                    onChange={(e) => setSearchTerkirim(e.target.value)}
                    className="border px-4 py-2 mb-4 w-full"
                />
                <table className="w-full text-sm border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">No</th>
                            <th className="border p-2">Tanggal Surat Keluar</th>
                            <th className="border p-2">No.Agenda</th>
                            <th className="border p-2">Tanggal Surat</th>
                            <th className="border p-2">Kategori Surat</th>
                            <th className="border p-2">Penerima</th>
                            <th className="border p-2">Lampiran</th>
                            <th className="border p-2">Berkas</th>
                            <th className="border p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuratTerkirim.map((item, index) => (
                        <tr key={item.id}>
                            <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{item.tanggal_surat_keluar}</td>
                                <td className="border p-2">{item.no_agenda}</td>
                                <td className="border p-2">{item.tanggal_surat}</td>
                                <td className="border p-2">{item.kategori?.nama}</td>
                                <td className="border p-2">{item.penerima}</td>
                                <td className="border p-2">{item.lampiran}</td>
                                <td className="border p-2"><a href={`/storage/${item.berkas}`} target="_blank" className="text-blue-600 underline">Lihat</a></td>
                            <td className="border p-2">
                            {item.periksa_surat_keluar.length > 0
                                ? item.periksa_surat_keluar[0].status
                                : '-'}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
        </div>
        {/* Modal Tambah Surat */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded w-1/2 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Tambah Surat Keluar</h2>
                    <form  onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="block font-medium text-gray-700">Tanggal Surat Keluar</label>
                            <input
                                name="tanggal_surat_keluar"
                                type="date"
                                value={form.tanggal_surat_keluar || ""}
                                onChange={handleFormChange}
                                className="w-full border px-2 py-1"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-medium text-gray-700">Nomor Agenda</label>
                            <input
                                name="no_agenda"
                                type="text"
                                value={form.no_agenda || ""}
                                onChange={handleFormChange}
                                className="w-full border px-2 py-1"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-medium text-gray-700">Kode Surat</label>
                            <input
                                name="kode_surat"
                                type="text"
                                value={form.kode_surat || ""}
                                onChange={handleFormChange}
                                className="w-full border px-2 py-1"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-medium text-gray-700">Nomor Surat</label>
                            <input
                                name="no_surat"
                                type="text"
                                value={form.no_surat || ""}
                                onChange={handleFormChange}
                                className="w-full border px-2 py-1" />
                        </div>
                        <div className="mb-2">
                            <label className="block font-medium text-gray-700">Tanggal Surat</label>
                            <input
                                name="tanggal_surat"
                                type="date"
                                value={form.tanggal_surat || ""}
                                onChange={handleFormChange}
                                className="w-full border px-2 py-1"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-medium text-gray-700">Kategori Surat</label>
                            <select
                                name="kategori_id"
                                onChange={handleFormChange}
                                className="w-full border px-2 py-1"
                                >
                                <option value="">Pilih Kategori</option>
                                {(kategoriSurat || []).map((kategori) => (
                                    <option key={kategori.id} value={kategori.id}>
                                    {kategori.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="block font-medium text-gray-700">Tujuan</label>
                            <input
                                name="penerima"
                                type="text"
                                value={form.penerima || ""}
                                onChange={handleFormChange}
                                className="w-full border px-2 py-1"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-medium text-gray-700">Lampiran</label>
                            <input
                                name="lampiran"
                                type="text"
                                value={form.lampiran || ""}
                                onChange={handleFormChange}
                                className="w-full border px-2 py-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Berkas (PDF/DOC)</label>
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-3 py-1 rounded"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowJenisSuratModal(true);
                                }}
                            >
                                Buat Surat
                            </button>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Tutup</button>
                            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Simpan</button>
                        </div>
                        {jenisSuratDipilih === 'surat_tugas' && (
                            <FormSuratTugas form={form} onChange={handleFormChange} />
                        )}
                        {jenisSuratDipilih === 'surat_kp' && (
                            <FormSuratKP form={form} onChange={handleFormChange} />
                        )}
                        {jenisSuratDipilih === 'surat_danaraker' && (
                            <FormSuratDanaRaker form={form} onChange={handleFormChange} />
                        )}
                        {jenisSuratDipilih === 'surat_dekan' && (
                            <FormSKDekan form={form} onChange={handleFormChange} />
                        )}
                    </form>
                </div>
            </div>
        )}
        {showViewModal && selectedSuratKeluar && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-[600px] rounded p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                    <h2 className="text-lg font-semibold">Detail Surat Keluar</h2>
                    <div className="mt-4 space-y-2">
                        <p><strong>No Surat:</strong> {selectedSuratKeluar.no_surat}</p>
                        <p><strong>Tanggal Surat:</strong> {selectedSuratKeluar.tanggal_surat}</p>
                        <p><strong>Penerima:</strong> {selectedSuratKeluar.penerima}</p>
                        <p><strong>Kategori:</strong> {selectedSuratKeluar.kategori?.nama}</p>
                        <p><strong>Lampiran:</strong> {selectedSuratKeluar.lampiran}</p>
                        <p>
                            <strong>Berkas:</strong>{' '}
                            <a
                            href={`/storage/${selectedSuratKeluar.berkas}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                            >
                            Lihat Berkas
                            </a>
                        </p>
                    </div>
                    <select className="border px-3 py-2 rounded w-full mt-4" value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)}>
                        <option value="">Pilih Penerima</option> {users.map((user) => ( <option key={user.id} value={user.id}> {user.name} ({user.role}) </option> ))}
                    </select>
                    <div className="flex justify-end mt-6 space-x-3">
                        <button onClick={handleKirim} className="bg-yellow-500 text-white px-4 py-2 rounded">Kirim</button>
                        <button
                        onClick={() => setShowViewModal(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        >
                        Tutup
                        </button>
                    </div>
                </div>
             </div>
        )}

        <ModalPilihJenisSurat
            show={showJenisSuratModal}
            onClose={() => setShowJenisSuratModal(false)}
            onPilih={(jenis) => {
                setJenisSuratDipilih(jenis);
                // Lanjutkan logika kalau mau munculkan form sesuai jenis nanti
            }}
        />
    </AuthenticatedLayout>
  );
}
