import { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ kategori , search}) {
    const [nama, setNama] = useState('');
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredKategori = kategori.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/kategori-surat', { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/kategori-surat', { nama }, {
            onSuccess: () => {
                setShowCreatePopup(false);
                setNama('');
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        router.put(`/kategori-surat/${editData.id}`, { nama }, {
            onSuccess: () => {
                setShowEditPopup(false);
                setNama('');
                setEditData(null);
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kategori ini?')) {
            router.delete(`/kategori-surat/${id}`);
        }
    };

    const openEditPopup = (item) => {
        setEditData(item);
        setNama(item.nama);
        setShowEditPopup(true);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kategori Surat</h2>}>
            <div className="p-6 w-full mx-auto bg-white rounded shadow">
                <div className="flex justify-between mb-4">
                    
                    <form onSubmit={handleSearch} className="flex items-center">
                            <input
                                type="text"
                                placeholder="Cari kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                            >
                                Cari
                            </button>
                    </form>
                    <button
                        onClick={() => setShowCreatePopup(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Tambah Kategori
                    </button>
                </div>


                <table className="w-full border border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border px-4 py-2">No</th>
                            <th className="border px-4 py-2">Nama Kategori</th>
                            <th className="border px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kategori.map((item, index) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{item.nama}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => openEditPopup(item)}
                                        className="px-2 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Popup Tambah */}
            {showCreatePopup && (
                <PopupForm
                    title="Tambah Kategori Baru"
                    nama={nama}
                    setNama={setNama}
                    onClose={() => setShowCreatePopup(false)}
                    onSubmit={handleSubmit}
                />
            )}

            {/* Popup Edit */}
            {showEditPopup && (
                <PopupForm
                    title="Edit Kategori"
                    nama={nama}
                    setNama={setNama}
                    onClose={() => {
                        setShowEditPopup(false);
                        setEditData(null);
                        setNama('');
                    }}
                    onSubmit={handleEditSubmit}
                />
            )}
        </AuthenticatedLayout>
    );
}

function PopupForm({ title, nama, setNama, onClose, onSubmit }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Nama Kategori</label>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
