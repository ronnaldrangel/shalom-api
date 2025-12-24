'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const getBrandingContent = () => {
        if (pathname.includes('/login')) {
            return {
                title: 'Integra tu APP con nuestra API.',
                description: 'Conecta tu negocio con la lista de agencias más grande del país en segundos.',
            };
        }
        if (pathname.includes('/register')) {
            return {
                title: 'Únete a la plataforma logística del futuro.',
                description: 'Regístrate hoy y obtén acceso inmediato a miles de puntos de envío Shalom.',
            };
        }
        if (pathname.includes('/forgot-password')) {
            return {
                title: 'Recupera el acceso a tu cuenta.',
                description: 'No te preocupes, te ayudaremos a restablecer tu contraseña en unos simples pasos.',
            };
        }
        return {
            title: 'Tu aliado logístico digital.',
            description: 'Integración para ver las agencias de Shalom.',
        };
    };

    const content = getBrandingContent();

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-950 font-sans">
            {/* Brand Side (Visible on larger screens) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-red">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/bg/bg-auth.png"
                        alt="Authentication Background"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-red via-brand-red/80 to-transparent" />
                </div>

                <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
                    <Link href="/" className="flex items-center gap-2 group w-fit">
                        <img src="/logos/logo_white.svg" alt="Shalom API" className="h-4 w-auto" />
                    </Link>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                            {content.title}
                        </h1>
                        <p className="text-xl text-red-100 font-medium opacity-90">
                            {content.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium text-red-200">
                        <span>© 2025 Powered by Wazend</span>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-20">
                <div className="w-full max-w-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
