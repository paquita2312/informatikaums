import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function UserEdit({ user, roles, onClose }) {
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        jabatan: user.jabatan || '',
        role: user.role || '',
        password: '', // kosongkan password, user isi kalau ingin ganti
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.put(route('user.update', user.id), formData, {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                // Handle error kalau perlu
            },
        });
    };

    return (
        <>
            <h3 className="text-lg font-semibold mb-4">Edit Pengguna</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Nama</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Jabatan</label>
                    <input
                        type="text"
                        name="jabatan"
                        value={formData.jabatan}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">-- Pilih Role --</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Password <small>(kosongkan jika tidak diubah)</small></label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Isi jika ingin mengganti password"
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
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </>
    );
}
