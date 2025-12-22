'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al registrarse');
            }

            if (data.needsVerification) {
                setShowVerification(true);
                toast.success('Registro exitoso. Por favor ingresa el código enviado a tu correo.');
            } else {
                router.push('/auth/login?registered=true');
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    code: verificationCode,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al verificar código');
            }

            toast.success('Cuenta verificada correctamente');
            router.push('/auth/login?registered=true');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {showVerification ? 'Verifica tu cuenta' : 'Crea tu cuenta'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {showVerification
                        ? `Hemos enviado un código de verificación a ${formData.email}`
                        : 'Completa los detalles para comenzar tu integración.'
                    }
                </p>
            </div>

            {!showVerification ? (
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                Nombre completo
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all duration-200 sm:text-sm"
                                placeholder="Juan Pérez"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email-address" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                Correo electrónico
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all duration-200 sm:text-sm"
                                placeholder="nombre@ejemplo.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all duration-200 sm:text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-red hover:bg-brand-red-hover focus:outline-none focus:ring-4 focus:ring-brand-red/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-red/20"
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>
            ) : (
                <form className="space-y-6" onSubmit={handleVerificationSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2 text-center">
                            <label htmlFor="code" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Introduce el código de 6 dígitos
                            </label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                className="block w-full px-3 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all duration-200 text-center tracking-[0.75em] text-2xl font-bold"
                                placeholder="000000"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-red hover:bg-brand-red-hover focus:outline-none focus:ring-4 focus:ring-brand-red/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-red/20"
                    >
                        {loading ? 'Verificando...' : 'Verificar Cuenta'}
                    </button>
                </form>
            )}

            <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/auth/login" className="font-bold text-brand-red hover:text-brand-red-hover transition-colors">
                    Inicia sesión
                </Link>
            </p>
        </div>
    );
}
