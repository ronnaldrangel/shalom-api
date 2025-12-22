'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
    lastUpdated?: string;
    title?: string;
    description?: string;
}

interface User {
    id: string;
    email: string;
    name?: string;
}

export default function Header({
    lastUpdated,
    description = "Consulta todas las agencias Shalom en tiempo real. Encuentra ubicaciones, horarios y servicios de agencias."
}: HeaderProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const formattedDate = lastUpdated
        ? new Date(lastUpdated).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        : null;

    return (
        <header className="bg-brand-red shadow-lg shadow-brand-red/10 border-b border-brand-red/20">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                            <img src="/logos/logo_white.svg" alt="Shalom API" className="h-4 w-auto" />
                        </Link>

                        <div className="flex items-center gap-2 p-1 bg-black/10 rounded-xl backdrop-blur-sm border border-white/5">
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-sm font-bold bg-white text-brand-red rounded-lg hover:bg-red-50 transition-all shadow-md flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Mi Panel
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-white hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        Acceder
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold bg-white text-brand-red rounded-lg hover:bg-red-50 transition-all shadow-md"
                                    >
                                        Registro
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hidden md:block ">
                        <div className="flex-1">
                            <p className="text-red-100 text-sm font-base opacity-90 max-w-2xl">
                                {description} Actualizado: {formattedDate}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
