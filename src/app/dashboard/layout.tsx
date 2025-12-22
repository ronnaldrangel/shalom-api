'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  KeyIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  BookOpenIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import Loader from '../components/Loader';
import { useTheme } from 'next-themes';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role?: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Verificar si hay usuario en localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader message="Verificando sesión..." /></div>;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'API Key', href: '/dashboard/apikey', icon: KeyIcon },
    { name: 'Logs', href: '/dashboard/logs', icon: ClipboardDocumentListIcon },
    { name: 'Documentación', href: '/dashboard/docs', icon: BookOpenIcon },
    { name: 'Perfil', href: '/dashboard/profile', icon: UserCircleIcon },
    { name: 'Planes', href: 'https://shalom-api.com/pricing/', icon: CreditCardIcon },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: ShieldCheckIcon });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* Mobile Sidebar (Off-canvas) */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />

        {/* Panel */}
        <div className={`absolute top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 pt-8 pb-4">
              <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center hover:opacity-80 transition-opacity">
                <img src="/logos/logo_red.svg" alt="Shalom API" className="h-4 w-auto dark:hidden" />
                <img src="/logos/logo_white.svg" alt="Shalom API" className="h-4 w-auto hidden dark:block" />
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-6 flex-1 px-4 space-y-1.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`${isActive
                      ? 'bg-brand-red/5 text-brand-red dark:bg-brand-red/10 dark:text-red-400'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'
                      } group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200`}
                  >
                    <item.icon className={`${isActive ? 'text-brand-red' : 'text-gray-400 dark:text-gray-500'} mr-3 h-5 w-5`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <button
                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setIsSidebarOpen(false); }}
                className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                {mounted && (
                  <>
                    {theme === 'dark' ? <SunIcon className="mr-3 h-5 w-5 text-yellow-500" /> : <MoonIcon className="mr-3 h-5 w-5" />}
                    {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-400 hover:text-red-600 dark:hover:bg-red-900/10 rounded-xl transition-all"
              >
                <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-72">
            <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
              <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
                <Link href="/" className="flex items-center flex-shrink-0 px-6 mb-10 hover:opacity-80 transition-opacity">
                  <img src="/logos/logo_red.svg" alt="Shalom API" className="h-4 w-auto dark:hidden" />
                  <img src="/logos/logo_white.svg" alt="Shalom API" className="h-4 w-auto hidden dark:block" />
                </Link>

                <nav className="mt-2 flex-1 px-4 space-y-1.5">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${isActive
                          ? 'bg-brand-red/5 text-brand-red dark:bg-brand-red/10 dark:text-red-400'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'
                          } group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200`}
                      >
                        <item.icon
                          className={`${isActive
                            ? 'text-brand-red'
                            : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                            } mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200`}
                          aria-hidden="true"
                        />
                        {item.name}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-red shadow-[0_0_8px_rgba(238,42,47,0.5)]" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="flex-shrink-0 p-6 space-y-2">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
                >
                  {mounted && (
                    <>
                      {theme === 'dark' ? (
                        <SunIcon className="mr-3 h-5 w-5 text-yellow-500" />
                      ) : (
                        <MoonIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-amber-600" />
                      )}
                      {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 dark:hover:text-red-400 rounded-xl transition-all duration-200 group"
                >
                  <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          {/* Mobile Topbar */}
          <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/logos/logo_red.svg" alt="Shalom API" className="h-4 w-auto dark:hidden" />
              <img src="/logos/logo_white.svg" alt="Shalom API" className="h-4 w-auto hidden dark:block" />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gray-50/50 dark:bg-gray-950">
            <div className="py-10">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
