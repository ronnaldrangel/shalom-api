'use client';

export default function Loader({ message = 'Cargando...' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-800 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-brand-red rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-sm font-bold text-gray-500 dark:text-gray-400 animate-pulse tracking-widest uppercase">
                {message}
            </p>
        </div>
    );
}
