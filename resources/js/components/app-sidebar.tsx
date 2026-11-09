import { Link, usePage } from '@inertiajs/react';
import {
    ClipboardList,
    Home,
    LayoutGrid,
    Package,
    ShieldCheck,
    Store,
    Tags,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import admin from '@/routes/admin';
import seller from '@/routes/seller';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;

    const accountItems: NavItem[] = auth.seller
        ? [
              {
                  title: 'Espace vendeur',
                  href: seller.dashboard(),
                  icon: Store,
              },
              ...(auth.seller.status === 'approved'
                  ? [
                        {
                            title: 'Mes produits',
                            href: seller.products.index(),
                            icon: Package,
                        },
                    ]
                  : []),
          ]
        : [{ title: 'Mon espace', href: dashboard(), icon: LayoutGrid }];

    const adminItems: NavItem[] = [
        {
            title: 'Tableau de bord',
            href: admin.dashboard(),
            icon: ShieldCheck,
        },
        { title: 'Vendeurs', href: admin.sellers.index(), icon: Users },
        { title: 'Produits', href: admin.products.index(), icon: Package },
        { title: 'Catégories', href: admin.categories.index(), icon: Tags },
        { title: 'Journal', href: admin.auditLog(), icon: ClipboardList },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {auth.user.is_admin && (
                    <NavMain items={adminItems} label="Administration" />
                )}
                {!auth.user.is_admin && <NavMain items={accountItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter
                    items={[
                        { title: 'Voir le site', href: home(), icon: Home },
                    ]}
                    className="mt-auto"
                />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
