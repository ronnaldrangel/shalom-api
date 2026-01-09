'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Footer() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDarkMode = resolvedTheme === 'dark';

    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
    };

    const tags = ['Shalom API', 'Agencias Shalom', 'Tiempo Real', 'Logística Perú', 'API Gratuita'];

    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 mt-20">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 h-8">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <span className="text-brand-red font-black text-sm">S</span>
                            </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">Shalom API</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto md:mx-0">
                            Esta API no es oficial ni está afiliada a Shalom. Su uso es exclusivamente con fines de investigación, análisis y pruebas técnicas. No cuenta con autorización, validación ni soporte por parte de Shalom, y cualquier referencia a la marca es únicamente con fines informativos.
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            <a href="/contact" className="text-xs font-bold text-gray-500 hover:text-brand-red transition-colors uppercase tracking-widest">
                                Contacto
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-red/30 transition-all group"
                        >
                            {!mounted ? (
                                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                            ) : isDarkMode ? (
                                <>
                                    <SunIcon className="h-5 w-5 text-yellow-500 group-hover:rotate-45 transition-transform" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Modo Claro</span>
                                </>
                            ) : (
                                <>
                                    <MoonIcon className="h-5 w-5 text-brand-red group-hover:-rotate-12 transition-transform" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Modo Oscuro</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-900 mt-10 pt-10 flex flex-wrap justify-center gap-3">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-gray-50 dark:bg-gray-900 text-[10px] font-black text-gray-400 dark:text-gray-500 rounded-full border border-gray-100 dark:border-gray-800 uppercase tracking-tighter hover:border-brand-red/20 hover:text-brand-red transition-all cursor-default"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </footer>
    );
}
