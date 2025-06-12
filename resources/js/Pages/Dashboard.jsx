import React from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard() {
    const { data } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="font-black text-2xl mb-4">Dashboard : {data.role}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.role === 'admin_fakultas' && (
                        <>
                            <Card title="Surat Masuk" count={data.surat_masuk} icon="📩" />
                            <Card title="Surat Keluar" count={data.surat_keluar} icon="📤" />
                            <Card title="Periksa Surat Masuk" count={data.periksa_surat_masuk} icon="📥" />
                            <Card title="Periksa Surat Keluar" count={data.periksa_surat_keluar} icon="📤" />
                            <Card title="Disposisi" count={data.disposisi} icon="✅" />
                            <Card title="Pengguna" count={data.pengguna} icon="👤" />
                        </>
                    )}

                    {/* Role lain bisa ditambahkan kondisi sesuai kebutuhan */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const Card = ({ title, count, icon }) => (
    <div className="bg-white text-black rounded-xl p-4 shadow flex justify-between items-center">
        <div>
            <div className="text-gray-600 text-sm">{title.toUpperCase()}</div>
            <div className="text-3xl font-bold">{count}</div>
        </div>
        <div className="text-4xl">{icon}</div>
    </div>
);
