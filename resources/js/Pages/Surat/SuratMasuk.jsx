import { useState, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Webcam from 'react-webcam';
import {usePage} from '@inertiajs/react';

export default function SuratMasuk({ suratMasuk, kategori, users, suratTerkirim }) {

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        tanggal_surat_masuk: '',
        no_agenda: '',
        tanggal_surat: '',
        kategori_id: '',
        pengirim: '',
        lampiran: '',
        berkas: null
    });

    const [searchMasuk, setSearchMasuk] = useState('');
    const [searchTerkirim, setSearchTerkirim] = useState('');

    const filteredSurat = suratMasuk.filter((s) =>
        s.no_agenda.toLowerCase().includes(searchMasuk.toLowerCase()) ||
        s.pengirim.toLowerCase().includes(searchMasuk.toLowerCase())
    );

    const filteredSuratTerkirim = suratTerkirim.filter((s) =>
        s.no_agenda.toLowerCase().includes(searchTerkirim.toLowerCase()) ||
        s.pengirim.toLowerCase().includes(searchTerkirim.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
         Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                data.append(key, value);
            }
        });

        if (editing) {
            data.append('_method', 'PUT');
            router.post(`/surat-masuk/${editing}`, data, {
                forceFormData: true,
                preserveState: false,
                onSuccess: () => resetForm(),
                onError: (err) => console.log(err),
            });
        } else {
            router.post('/surat-masuk', data, {
                forceFormData: true,
                preserveState: false,
                onError: (errors) => {
                    console.log(errors);
                },
                onSuccess: () => resetForm(),
            });
        }
    };

    const resetForm = () => {
        setForm({
            tanggal_surat_masuk: '',
            no_agenda: '',
            tanggal_surat: '',
            kategori_id: '',
            pengirim: '',
            lampiran: '',
            berkas: null,
        });
        setEditing(null);
        setShowForm(false);
        setErrorNoAgenda('');
    };

    const handleEdit = (s) => {
        setForm({
            tanggal_surat_masuk: s.tanggal_surat_masuk,
            no_agenda: s.no_agenda,
            tanggal_surat: s.tanggal_surat,
            kategori_id: s.kategori_id,
            pengirim: s.pengirim,
            lampiran: s.lampiran,
            berkas: null // kosongkan agar tidak kirim string (berkas lama)
        });
        setEditing(s.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (confirm('Hapus surat ini?')) {
            router.delete(`/surat-masuk/${id}`);
        }
    };

    const [errorNoAgenda, setErrorNoAgenda] = useState('');
    const handleNoAgendaChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setForm({ ...form, no_agenda: value });
            setErrorNoAgenda('');
        } else {
            setErrorNoAgenda('Nomor agenda hanya boleh berisi angka.');
        }
    };

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState(null);

    const handleView = (surat) => {
    setSelectedSurat(surat);
    setShowViewModal(true);
    };

    const [receiverEmail, setReceiverEmail] = useState('');
    const handleKirim = () => {
        if (!receiverEmail) {
            alert('Pilih penerima terlebih dahulu.');
            return;
        }

        router.post('/periksa-surat-masuk', {
            surat_masuk_id: selectedSurat.id,
            penerima_id: receiverEmail,
        }, {
            onSuccess: () => {
                setReceiverEmail('');
                setShowViewModal(false);
            }
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Surat Masuk</h2>}>
            <div className="p-6 bg-white rounded shadow">
                <div className="flex justify-between mb-4">
                    <input type="text" placeholder="Cari..." value={searchMasuk} onChange={e => setSearchMasuk(e.target.value)} className="border rounded px-3 py-1" />
                    <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Tambah Data</button>
                </div>
                <table className="w-full text-sm border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">No</th>
                            <th className="border p-2">Tanggal Surat Masuk</th>
                            <th className="border p-2">No.Agenda</th>
                            <th className="border p-2">Tanggal Surat</th>
                            <th className="border p-2">Kategori Surat</th>
                            <th className="border p-2">Pengirim</th>
                            <th className="border p-2">Lampiran</th>
                            <th className="border p-2">Berkas</th>
                            <th className="border p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSurat.map((s, i) => (
                            <tr key={s.id}>
                                <td className="border p-2">{i + 1}</td>
                                <td className="border p-2">{s.tanggal_surat_masuk}</td>
                                <td className="border p-2">{s.no_agenda}</td>
                                <td className="border p-2">{s.tanggal_surat}</td>
                                <td className="border p-2">{s.kategori?.nama}</td>
                                <td className="border p-2">{s.pengirim}</td>
                                <td className="border p-2">{s.lampiran}</td>
                                <td className="border p-2"><a href={`/storage/${s.berkas}`} target="_blank" className="text-blue-600 underline">Lihat</a></td>
                                <td className="border p-2 space-x-2">
                                    <button
                                        onClick={() => handleView(s)}
                                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                        View
                                    </button>
                                    <button onClick={() => handleEdit(s)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                                    <button onClick={() => handleDelete(s.id)} className="bg-red-600 text-white px-2 py-1 rounded">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table >
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
                            <th className="border p-2">Tanggal Surat Masuk</th>
                            <th className="border p-2">No.Agenda</th>
                            <th className="border p-2">Tanggal Surat</th>
                            <th className="border p-2">Kategori Surat</th>
                            <th className="border p-2">Pengirim</th>
                            <th className="border p-2">Lampiran</th>
                            <th className="border p-2">Berkas</th>
                            <th className="border p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuratTerkirim.map((surat, index) => (
                        <tr key={surat.id}>
                            <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{surat.tanggal_surat_masuk}</td>
                                <td className="border p-2">{surat.no_agenda}</td>
                                <td className="border p-2">{surat.tanggal_surat}</td>
                                <td className="border p-2">{surat.kategori?.nama}</td>
                                <td className="border p-2">{surat.pengirim}</td>
                                <td className="border p-2">{surat.lampiran}</td>
                                <td className="border p-2"><a href={`/storage/${surat.berkas}`} target="_blank" className="text-blue-600 underline">Lihat</a></td>
                            <td className="border p-2">
                            {surat.periksa_surat_masuk.length > 0
                                ? surat.periksa_surat_masuk[0].status
                                : '-'}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showViewModal && selectedSurat && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-[600px] rounded p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-green-700 mb-4">Data Surat</h2>

                    <div className="space-y-2 text-gray-800 text-sm">
                        <p><b>Tanggal Surat Masuk:</b> {selectedSurat.tanggal_surat_masuk}</p>
                        <p><b>Nomor Agenda:</b> {selectedSurat.no_agenda}</p>
                        <p><b>Kode Surat:</b> {selectedSurat.kode_surat}</p>
                        <p><b>Nomor Surat Masuk:</b> {selectedSurat.nomor_surat}</p>
                        <p><b>Tanggal Surat:</b> {selectedSurat.tanggal_surat}</p>
                        <p><b>Kategori Surat:</b> {selectedSurat.kategori?.nama}</p>
                        <p><b>Pengirim:</b> {selectedSurat.pengirim}</p>
                        <p><b>Perihal:</b> {selectedSurat.perihal}</p>
                        <p><b>Lampiran:</b> {selectedSurat.lampiran}</p>
                    </div>
                    <select className="border px-3 py-2 rounded w-full mt-4" value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)}>
                        <option value="">Pilih Penerima</option> {users.map((user) => ( <option key={user.id} value={user.id}> {user.name} ({user.role}) </option> ))}
                    </select>

                    <div className="flex justify-end mt-6 space-x-3">
                        <button onClick={handleKirim} className="bg-yellow-500 text-white px-4 py-2 rounded">Kirim</button>
                        <button
                        onClick={() => setShowViewModal(false)}
                        className="bg-red-400 text-white px-4 py-2 rounded"
                        >
                        Tutup
                        </button>
                    </div>
                </div>
            </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center ">
                    <div className="bg-white w-[600px] rounded p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-[500px] space-y-3">
                            <h3 className="text-xl font-semibold">{editing ? 'Edit' : 'Tambah'} Surat Masuk</h3>
                            <label className="block font-medium text-gray-700">Tanggal Surat Masuk</label>
                            <input
                                type="date"
                                value={form.tanggal_surat_masuk}
                                onChange={e => setForm({ ...form, tanggal_surat_masuk: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            <label className="block font-medium text-gray-700">No Agenda</label>
                            <input
                                type="text"
                                placeholder="No Agenda"
                                value={form.no_agenda}
                                onChange={handleNoAgendaChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />{errorNoAgenda && <p className="text-red-600 text-sm mt-1">{errorNoAgenda}</p>}
                            <label className="block font-medium text-gray-700">Tanggal Surat</label>
                            <input
                                type="date"
                                value={form.tanggal_surat}
                                onChange={e => setForm({ ...form, tanggal_surat: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            <label className="block font-medium text-gray-700">Kategori Surat</label>
                            <select
                                value={form.kategori_id}
                                onChange={e => setForm({ ...form, kategori_id: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                                required>
                                <option value="">Pilih Kategori</option>
                                {kategori.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                            </select>
                            <label className="block font-medium text-gray-700">Pengirim</label>
                            <input
                                type="text"
                                value={form.pengirim}
                                onChange={e => setForm({ ...form, pengirim: e.target.value })}
                                placeholder="Pengirim"
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            <label className="block font-medium text-gray-700">Lampiran</label>
                            <input
                                type="text"
                                value={form.lampiran}
                                onChange={e => setForm({ ...form, lampiran: e.target.value })}
                                placeholder="Lampiran"
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            <label className="block font-medium text-gray-700">Berkas</label>
                            <input
                                type="file"
                                onChange={e => setForm({ ...form, berkas: e.target.files[0] })}
                                className="w-full"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required={!editing}
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={resetForm} className="border px-4 py-2 rounded">Batal</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
                            </div>
                        </form>
                    </div>

                </div>
            )}
        </AuthenticatedLayout>
    );
}
