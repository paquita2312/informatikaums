import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#2a6940] pt-6 sm:justify-center sm:pt-0">
            <div className="w-full flex justify-center">
                <Link href="/">
                    <ApplicationLogo />
                </Link>
            </div>

            <div className="mt-6 w-full h-[500px] overflow-hidden bg-[#2ECC64] px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
