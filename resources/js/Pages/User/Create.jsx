import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

export default function UserCreate({ roles = []}) {
    const [form, setForm] = useState({
        email: '',
        name: '',
        jabatan: '',
        role: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('user.store'), form);
    };

    return (
            <div className=''>
                <div>
                    <h1 className='font-black text-3xl'>Tambah Pengguna</h1>
                </div>
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Masukkan email"
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium text-gray-700">Nama</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Masukkan nama"
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium text-gray-700">Jabatan</label>
                        <input
                            type="text"
                            name="jabatan"
                            value={form.jabatan}
                            onChange={handleChange}
                            placeholder="Masukkan jabatan"
                            className="mt-1 block w-full border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            required
                        >
                            <option value="" disabled>Pilih Role</option>
                            <option value="admin_prodi">Admin Prodi</option>
                            <option value="admin_fakultas">Admin Fakultas</option>
                            <option value="pimpinan">Pimpinan</option>
                            <option value="karyawan">Karyawan</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Masukkan password"
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Simpan
                    </button>
                </form>
            </div>


    );
}
