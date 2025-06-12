import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/Components/Breadcrumb';
import PopupWrapper from '@/Components/PopupWrapper';
import UserCreate from './Create'; // Form tambah user
import UserEdit from './Edit';     // Form edit user (buat nanti)

export default function UserPage() {
    const { users, roles, filters } = usePage().props;
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editUserData, setEditUserData] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('user.index'), { search }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus user ini?')) {
            router.delete(route('user.destroy', id));
        }
    };

    const openEditPopup = (user) => {
        setEditUserData(user);
        setShowEditPopup(true);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Data Pengguna</h2>}
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 w-full">
                <Breadcrumb items={[
                    { label: 'Manajemen', href: '#' },
                    { label: 'Pengguna', href: '/user' }
                ]} />

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-semibold">Daftar Pengguna</h3>
                        <button
                            onClick={() => setShowCreatePopup(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Tambah Pengguna
                        </button>
                    </div>
                    {/* Input Search */}
                    <form onSubmit={handleSearch} className="mb-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau email..."
                            className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
                        />
                    </form>

                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left border-b font-semibold text-gray-700">
                                <th className="py-2">Nama</th>
                                <th className="py-2">Email</th>
                                <th className="py-2">Jabatan</th>
                                <th className="py-2">Role</th>
                                <th className="py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-gray-500">Tidak ada data pengguna.</td>
                                </tr>
                            )}
                            {users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="py-2">{user.name}</td>
                                    <td className="py-2">{user.email}</td>
                                    <td className="py-2">{user.jabatan ?? '-'}</td>
                                    <td className="py-2 capitalize">{user.role?.replace('_', ' ') ?? '-'}</td>
                                    <td className="py-2">
                                        <button
                                            onClick={() => openEditPopup(user)}
                                            className="text-blue-600 hover:underline mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Popup Create User */}
            <PopupWrapper show={showCreatePopup} onClose={() => setShowCreatePopup(false)}>
                <UserCreate roles={roles} onClose={() => setShowCreatePopup(false)} />
            </PopupWrapper>

            {/* Popup Edit User */}
            <PopupWrapper show={showEditPopup} onClose={() => setShowEditPopup(false)}>
                {editUserData && (
                    <UserEdit user={editUserData} roles={roles} onClose={() => setShowEditPopup(false)} />
                )}
            </PopupWrapper>
        </AuthenticatedLayout>
    );
}
