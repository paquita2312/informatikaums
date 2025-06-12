import SidebarNav from './SidebarNav';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Mail, Send, Database, Inbox, InboxIcon } from 'lucide-react';
import { children } from 'react';
import LogoUMS from '../../../public/build/assets/ums.png'

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'admin_prodi';

    const mainNavLink = [
        { title: 'Dashboard', href: '/dashboard' ,  icon: <LayoutDashboard className="w-5 h-5" />},
    ];

    const masterNavLink = [
        {
        title: 'Master Data' ,
        icon: <InboxIcon />,
        children:[
            {title: 'Data Arsip', href:'/arsip'},
            {title: 'Kategori Surat', href:'/kategori-surat'},
        ]},
    ];

    const suratNavLink = [
        { title: 'Surat Masuk', href: '/surat-masuk' ,  icon: <LayoutDashboard className="w-5 h-5" />},
        { title: 'Surat Keluar', href: '/surat-keluar' ,  icon: <LayoutDashboard className="w-5 h-5" />},
    ];
    const userNavLink = [
        { title: 'Pengguna', href: '/user' ,  icon: <LayoutDashboard className="w-5 h-5" />},
    ];
    const periksaNavLink = [
        { title: 'Periksa Surat Masuk', href: '/periksa-surat-masuk' ,  icon: <LayoutDashboard className="w-5 h-5" />},
        { title: 'Periksa Surat Keluar', href: '/periksa-surat-keluar' ,  icon: <LayoutDashboard className="w-5 h-5" />},
    ];
    const historyNavLink = [
        { title: 'History', href: '/history' ,  icon: <LayoutDashboard className="w-5 h-5" />},
    ];
    const laporanNavLink = [
        { title: 'Laporan', href: '/laporan' ,  icon: <LayoutDashboard className="w-5 h-5" />},
    ];
    const disposisiNavLink = [
        { title: 'Disposisi', href: '/disposisi' ,  icon: <LayoutDashboard className="w-5 h-5" />},
    ];


    let roleBasedNavLink = [];

    if (userRole === 'admin_prodi') {
    roleBasedNavLink = [...mainNavLink, ...masterNavLink, ...suratNavLink, ...laporanNavLink];
    } else if (userRole === 'admin_fakultas') {
        roleBasedNavLink = [...mainNavLink, ...masterNavLink, ...disposisiNavLink, ...suratNavLink, ...userNavLink, ...periksaNavLink, ...historyNavLink, ...laporanNavLink];
    } else if (userRole === 'pimpinan') {
        roleBasedNavLink = [...mainNavLink, ...suratNavLink, ...periksaNavLink,...disposisiNavLink];
    } else if (userRole === 'karyawan') {
        roleBasedNavLink = [...mainNavLink, ...suratNavLink];
    }

    return (
        <Sidebar className="w-64 bg-white">
            <SidebarHeader className="h-20 flex items-center mb-8">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="h-20" asChild>
                            <Link href="/dashboard" className="text-xl font-bold">
                                <img src={LogoUMS} alt="Logo" className="w-12 h-12" />
                                <span className="text-2xl text-black capitalize">{userRole.replace('_', ' ')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="mt-8">
                <SidebarNav items={roleBasedNavLink} />
            </SidebarContent>
        </Sidebar>
    );
}
