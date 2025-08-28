'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, Activity, Menu } from 'lucide-react';
import { useUser } from '@/lib/auth/hoocks';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isLoading } = useUser();

  const navItems = useMemo(() => {
    const allItems = [
      {
        href: '/dashboard/users',
        icon: Users,
        label: 'Usuarios',
        allowedRoles: ['admin', 'superadmin', 'tecnico'],
      },
      {
        href: '/dashboard/general',
        icon: Settings,
        label: 'General',
        allowedRoles: ['admin', 'superadmin'],
      },
      {
        href: '/dashboard/activity',
        icon: Activity,
        label: 'Activity',
        allowedRoles: ['admin', 'superadmin'],
      },
      {
        href: '/dashboard/security',
        icon: Shield,
        label: 'Security',
        allowedRoles: ['admin', 'superadmin'],
      },
      {
        href: '/dashboard/mi-cuenta',
        icon: Users,
        label: 'Mi Cuenta',
        allowedRoles: ['socio'],
      },
    ];

    if (isLoading || !user) {
      return [];
    }

    return allItems.filter((item) => item.allowedRoles.includes(user.role));
  }, [user, isLoading]);

  return (
    <div className='flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full bg-background'>
      {/* Mobile header */}
      <div className='lg:hidden flex items-center justify-between border-b p-4'>
        <div className='flex items-center'>
          <span className='font-medium'>Menú</span>
        </div>
        <Button
          className='-mr-3'
          variant='ghost'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className='h-6 w-6' />
          <span className='sr-only'>Toggle sidebar</span>
        </Button>
      </div>

      <div className='flex flex-1 overflow-hidden h-full'>
        {/* Sidebar */}
        <aside
          className={`w-64 border-r lg:block ${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className='h-full overflow-y-auto p-4'>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className='shadow-none my-1 w-full justify-start cursor-pointer'
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className='h-4 w-4' />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className='flex-1 overflow-y-auto p-0 lg:p-4'>{children}</main>
      </div>
    </div>
  );
}
