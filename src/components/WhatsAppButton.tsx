"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const [whatsappUrl, setWhatsappUrl] = useState("");

    useEffect(() => {
        if (whatsappNumber) {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                setWhatsappUrl(`https://api.whatsapp.com/send?phone=${whatsappNumber}`);
            } else {
                setWhatsappUrl(`https://web.whatsapp.com/send?phone=${whatsappNumber}`);
            }
        }
    }, [whatsappNumber]);

    if (!whatsappNumber) return null;

    return (
        <a
            href={whatsappUrl || `https://api.whatsapp.com/send?phone=${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#128C7E] active:scale-95"
            aria-label="Contactar por WhatsApp"
        >
            <MessageCircle className="h-8 w-8" />
        </a>
    );
};
