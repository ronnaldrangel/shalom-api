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
  BookOpenIcon
} from '@heroicons/react/24/outline';
import Loader from '../components/Loader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
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
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-72">
            <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
              <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-6 mb-10">
                  <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-brand-red/20">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Shalom API</span>
                </div>

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

              <div className="flex-shrink-0 p-6">
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center shadow-lg shadow-brand-red/20">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Shalom API</span>
            </div>
            {/* Mobile menu button could go here */}
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
