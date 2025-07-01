import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BaggageClaim, ChartPie, HandCoins, LayoutDashboard, LayoutGrid, ShoppingBasket, ShoppingCart, UserPlus, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: { label: string; items: NavItem[] }[] = [
    {
        label: 'General',
        items: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Halaman Kasir',
                url: '/transactions/point-of-sales',
                icon: HandCoins,
            },
        ],
    },
    {
        label: 'Master Data',
        items: [
            {
                title: 'Categories',
                url: '/categories',
                icon: LayoutDashboard,
            },
            {
                title: 'Products',
                url: '/products',
                icon: ShoppingBasket,
            },
            {
                title: 'Suppliers',
                url: '/suppliers',
                icon: UserPlus,
            },
        ],
    },
    {
        label: 'Transactions',
        items: [
            {
                title: 'Purchases',
                url: '/purchases',
                icon: BaggageClaim,
            },
            {
                title: 'Transactions',
                url: '/transactions',
                icon: ShoppingCart,
            },
        ],
    },
    {
        label: 'Keuangan',
        items: [
            {
                title: 'Laporan Keuangan',
                url: '/laporan-keuangan',
                icon: ChartPie,
            },
        ],
    },
    {
        label: 'Akun',
        items: [
            {
                title: 'Users',
                url: '/users',
                icon: Users,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.is_admin;

    // Filter menu berdasarkan role
    const filteredNavItems = mainNavItems
        .map((section) => {
            // Jika bukan admin, hanya izinkan "Dashboard" dan "Halaman Kasir"
            if (!isAdmin) {
                if (section.label !== 'General') return null;
                const allowed = ['Dashboard', 'Halaman Kasir'];
                return {
                    ...section,
                    items: section.items.filter((item) => allowed.includes(item.title)),
                };
            }

            // Jika admin, tampilkan semua
            return section;
        })
        .filter(Boolean);

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
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
