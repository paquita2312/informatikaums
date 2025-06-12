import { Head, Link } from '@inertiajs/react';
import LogoUMS from '../assets/ums.png'

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-green-500 flex flex-col">
                {/* Header */}
                <header className="flex justify-between items-center px-40 py-4">
                    <div className="flex flex-col text-white font-black text-4xl tracking-wide">
                    <span>INFORMATIKA</span>

                    <span className="text-lg font-normal text-end">UMSURABAYA</span>
                    </div>
                    <nav className="text-white space-x-6 text-sm">
                    <a href="#" className="hover:underline">Home</a>
                    <a href="#" className="hover:underline">Log out</a>
                    </nav>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 items-center justify-center px-2">
                    <div className="flex justify-center items-center gap-4 max-w-6xl w-full">
                        {/* Text Section */}
                        <div className="flex text-white flex flex-col gap-4">
                            <h1 className="text-8xl font-extrabold">
                            E-ARSIP-
                            <span className="bg-white text-red-600 px-2">MU</span>
                            </h1>
                            <p className="text-4xl font-semibold">
                            Informasi Arsip fakultas Teknik
                            </p>
                        </div>

                        {/* Logo Section */}
                        <div className="flex justify-center flex-1">
                            <img
                            src={LogoUMS}
                            alt="Logo Universitas Muhammadiyah Surabaya"
                            className="w-auto h-auto object-contain"
                            />
                        </div>
                    </div>
                </main>

                {/* Footer / Login Button */}
                <footer className="bg-white px-10 py-6 flex justify-end">
                    <nav className="justify-end bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 transition">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Home
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            type="button"
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-white ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] "
                                        >
                                            Log in
                                        </Link>
                                    </>
                                )}
                     </nav>
                </footer>
            </div>
        </>
    );

}
