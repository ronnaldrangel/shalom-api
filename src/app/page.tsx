'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ContactPage() {
    const whatsappNumber = "51920789569"; // Placeholder number
    const whatsappMessage = "Hola, me gustaría recibir más información.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-[#ee2a2f] text-white selection:bg-white selection:text-[#ee2a2f]">
            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d11d22] rounded-full blur-[120px] opacity-60 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#991b1b] rounded-full blur-[120px] opacity-60 animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 max-w-2xl w-full px-6 text-center space-y-12">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold tracking-wider uppercase mb-4">
                        Atención Inmediata
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight italic">
                        ¿TIENES <span className="text-white/80">DUDAS?</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-red-100/80 font-medium max-w-lg mx-auto leading-relaxed">
                        Nuestro equipo está listo para despegar tu proyecto. Escríbenos ahora.
                    </p>
                </div>

                <div className="flex justify-center animate-in fade-in zoom-in duration-1000 delay-300 fill-mode-both">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-4 bg-white text-[#ee2a2f] px-10 py-5 rounded-2xl font-black text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                    >
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="bg-[#25D366] p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <svg
                                viewBox="0 0 24 24"
                                className="w-8 h-8 fill-white"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#ee2a2f]/60 mb-1">Click para abrir</span>
                            <span className="relative">WHATSAPP</span>
                        </div>
                    </a>
                </div>

                <div className="pt-20 animate-in fade-in duration-1000 delay-700 fill-mode-both">
                    <p className="text-white/40 text-sm font-bold tracking-[0.3em] uppercase">
                        SERVICIO 24/7
                    </p>
                </div>
            </div>
        </main>
    );
}
