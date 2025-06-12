import React from 'react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function DisposisiIndex(props) {
    const [disposisis, setDisposisis] = useState(props.disposisis);
    const { users } = props;
    const { auth } = usePage().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        surat_masuk_id: '',
        tanggal_surat_masuk: '',
        tanggal_terima_surat: '',
        nomor_surat_masuk: '',
        penerima_id: '',
        asal_surat: '',
        perihal: '',
        sifat: '',
        tindakan: [],
        catatan_disposisi: '',
    });

    const [selectedItem, setSelectedItem] = useState(null);

    const openModal = (item) => {
        setSelectedItem(item);
        setFormData({
            surat_masuk_id: item.surat_masuk_id || '',  // Pastikan ini selalu ada dan sama
            tanggal_surat_masuk: item.tanggal_surat_masuk || '',
            tanggal_terima_surat: '',
            nomor_surat_masuk: item.nomor_surat_masuk || '',
            penerima_id: '',
            asal_surat: '',
            perihal: '',
            sifat: '',
            tindakan: [],
            catatan_disposisi: '',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
        setFormData({
            surat_masuk_id: '',
            tanggal_surat_masuk: '',
            tanggal_terima_surat: '',
            nomor_surat_masuk: '',
            penerima_id: '',
            asal_surat: '',
            perihal: '',
            sifat: '',
            tindakan: [],
            catatan_disposisi: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTindakanChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            let newTindakan = [...prev.tindakan];
            if (checked) {
                newTindakan.push(value);
            } else {
                newTindakan = newTindakan.filter((item) => item !== value);
            }
            return { ...prev, tindakan: newTindakan };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit surat_masuk_id:', formData.surat_masuk_id);
        router.post('/disposisi', {
            surat_masuk_id: formData.surat_masuk_id,
            pengirim_id: auth.user.id,
            penerima_id: formData.penerima_id,
            tanggal_surat_masuk: formData.tanggal_surat_masuk,
            tanggal_terima_surat: formData.tanggal_terima_surat,
            nomor_surat_masuk: formData.nomor_surat_masuk,
            asal_surat: formData.asal_surat,
            perihal: formData.perihal,
            sifat: formData.sifat,
            tindakan: formData.tindakan,
            catatan_disposisi: formData.catatan_disposisi,
        }, {
            onSuccess: () => {
                const updatedDisposisis = disposisis.map((item) =>
                    item.surat_masuk_id === formData.surat_masuk_id
                        ? { ...item, status_disposisi: 'sudah' }
                        : item
                );
                setDisposisis(updatedDisposisis); // <-- tambahkan ini
                closeModal();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Data Disposisi</h1>
                {/* Table */}
                <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">No</th>
                            <th className="border px-4 py-2">Tanggal Surat Masuk</th>
                            <th className="border px-4 py-2">No Surat Masuk</th>
                            <th className="border px-4 py-2">Disposisi</th>
                            <th className="border px-4 py-2">Catatan Disposisi</th>
                            <th className="border px-4 py-2">Tindakan</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                            {disposisis.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        Tidak ada data disposisi.
                                    </td>
                                </tr>
                            ) : (
                                disposisis.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2">{item.tanggal_surat_masuk}</td>
                                        <td className="border px-4 py-2">{item.nomor_surat_masuk}</td>
                                        <td className="border px-4 py-2">{item.tujuan_disposisi_nama || '-'}</td>
                                        <td className="border px-4 py-2">{item.catatan_disposisi || '-'}</td>
                                        <td className="border px-4 py-2">
                                            {formData.tindakan.length === 0 ? '-' : formData.tindakan.join(', ')}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {item.status_disposisi === 'sudah' ? (
                                                <span className="text-green-600 font-semibold">Sudah Didisposisikan</span>
                                            ) : (
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                    onClick={() => openModal(item)}
                                                >
                                                    Disposisi ke Tujuan
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                    </tbody>
                </table>
                </div>
            </div>
            {/* Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[90%] md:w-[600px]">
                            <h2 className="text-xl font-bold mb-4">Form Disposisi</h2>
                            <div className="overflow-y-auto max-h-[65vh] pr-2">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block font-semibold">Tanggal Surat Masuk</label>
                                        <input
                                            type="date"
                                            name="tanggal_surat_masuk"
                                            value={formData.tanggal_surat_masuk}
                                            onChange={handleChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Tanggal Terima Surat</label>
                                        <input
                                            type="date"
                                            name="tanggal_terima_surat"
                                            value={formData.tanggal_terima_surat}
                                            onChange={handleChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Nomor Surat Masuk</label>
                                        <input
                                            type="text"
                                            name="nomor_surat_masuk"
                                            value={formData.nomor_surat_masuk}
                                            onChange={handleChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Tujuan Disposisi</label>
                                        <select
                                            name="penerima_id"
                                            value={formData.tujuan_disposisi}
                                            onChange={handleChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        >
                                            <option value="">-- Pilih Tujuan --</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Asal Surat</label>
                                        <input
                                            type="text"
                                            name="asal_surat"
                                            value={formData.asal_surat}
                                            onChange={handleChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Perihal</label>
                                        <input
                                            type="text"
                                            name="perihal"
                                            value={formData.perihal}
                                            onChange={handleChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Sifat</label>
                                        <select
                                            name="sifat"
                                            value={formData.sifat}
                                            onChange={handleChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        >
                                            <option value="">-- Pilih Sifat --</option>
                                           <option value="penting">Penting</option>
                                            <option value="segera">Segera</option>
                                            <option value="rahasia">Rahasia</option>
                                            <option value="biasa">Biasa</option>
                                        </select>
                                    </div>
                                    <div>
                                    <label className="block font-semibold mb-2">Tindakan</label>
                                    {['Tinjau', 'Setujui', 'Tolak', 'Tindak Lanjut'].map((label) => (
                                        <label key={label} className="inline-flex items-center mr-4">
                                        <input
                                            type="checkbox"
                                            name="tindakan"
                                            value={label}
                                            checked={formData.tindakan.includes(label)}
                                            onChange={handleTindakanChange}
                                            className="form-checkbox"
                                        />
                                        <span className="ml-2">{label}</span>
                                        </label>
                                    ))}
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Catatan Disposisi</label>
                                        <textarea
                                            name="catatan_disposisi"
                                            value={formData.catatan_disposisi}
                                            onChange={handleChange}
                                            className="w-full border px-3 py-2 rounded"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="bg-gray-500 text-white px-4 py-2 rounded"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-green-600 text-white px-4 py-2 rounded"
                                        >
                                            Kirim
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
        </AuthenticatedLayout>
    );
}


