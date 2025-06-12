import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { AppSidebar } from '@/Components/Sidebar';
import { Link, usePage } from '@inertiajs/react';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    if (!user) {
        return <div className="p-6 text-center">Memuat data pengguna...</div>;
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen w-full flex bg-gray-100">
            {/* Sidebar kiri */}
            <AppSidebar />

            {/* Konten kanan */}
            <div className="flex-1 flex flex-col !max-w-full !w-full">
                {/* Navbar atas */}
                <nav className="bg-white border-b border-gray-200">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-end">

                            {/* Dropdown Profil */}
                            <div className="flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="ml-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Optional header */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
        </SidebarProvider>
    );
}
