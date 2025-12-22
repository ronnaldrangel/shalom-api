'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            toast.success(data.message);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    ¿Olvidaste tu contraseña?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="email-address" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all duration-200 sm:text-sm"
                            placeholder="nombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-red hover:bg-brand-red-hover focus:outline-none focus:ring-4 focus:ring-brand-red/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-red/20"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                        </div>
                    ) : 'Enviar enlace'}
                </button>
            </form>

            <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                ¿Recordaste tu contraseña?{' '}
                <Link href="/auth/login" className="font-bold text-brand-red hover:text-brand-red-hover transition-colors">
                    Volver al inicio de sesión
                </Link>
            </p>
        </div>
    );
}
