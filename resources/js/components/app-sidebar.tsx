import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BoxIcon, DollarSign, FolderKanban, LayoutGrid, MessageSquareQuote, Receipt, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Testimoni',
        href: '/testimonies',
        icon: MessageSquareQuote, // ikon untuk testimoni atau komentar
    },
    {
        title: 'Category Services',
        href: '/category-services',
        icon: BoxIcon, // ikon untuk testimoni atau komentar
    },
    {
        title: 'Projects',
        href: '/projects',
        icon: FolderKanban, // ikon folder atau proyek
    },
    {
        title: 'Bukti Pembayaran',
        href: '/payments-proof',
        icon: Receipt, // ikon struk atau kwitansi
    },
    {
        title: 'Transaksi',
        href: '/transactions',
        icon: DollarSign,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
