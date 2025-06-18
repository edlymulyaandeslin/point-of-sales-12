import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BaggageClaim, LayoutDashboard, LayoutGrid, ShoppingBasket, ShoppingCart, UserPlus, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        url: '/users',
        icon: Users,
    },
    {
        title: 'Customers',
        url: '/customers',
        icon: UserPlus,
    },
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
        title: 'Transactions',
        url: '/transactions',
        icon: ShoppingCart,
    },
    {
        title: 'Suppliers',
        url: '/suppliers',
        icon: UserPlus,
    },
    {
        title: 'Purchases',
        url: '/purchases',
        icon: BaggageClaim,
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
