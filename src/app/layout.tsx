import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/init"; // Inicializar servicios de la aplicación

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShalomAPI - API de Agencias Shalom | Consulta Agencias en Tiempo Real",
  description: "ShalomAPI es la API oficial para consultar agencias Shalom en tiempo real. Encuentra ubicaciones, horarios y servicios de todas las agencias Shalom. API gratuita para desarrolladores.",
  keywords: [
    "Shalom",
    "shalom api",
    "shalom api agencias",
    "shalom agencias",
    "API agencias",
    "agencias Shalom",
    "ubicaciones Shalom",
    "horarios agencias",
    "servicios Shalom",
    "API gratuita",
    "consulta agencias"
  ],
  authors: [{ name: "Wazend" }],
  creator: "Wazend",
  publisher: "Wazend",
  robots: "index, follow",
  openGraph: {
    title: "ShalomAPI - API de Agencias Shalom",
    description: "Consulta agencias Shalom en tiempo real. API gratuita con información de ubicaciones, horarios y servicios.",
    type: "website",
    locale: "es_ES",
    siteName: "ShalomAPI",
    images: [
      {
        url: "/cover.png",
        width: 1200,
        height: 630,
        alt: "ShalomAPI - API de Agencias Shalom"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ShalomAPI - API de Agencias Shalom",
    description: "Consulta agencias Shalom en tiempo real. API gratuita con información completa.",
    images: ["/cover.png"]
  },
  alternates: {
    canonical: "https://shalom-api.wazend.net"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ShalomAPI",
    "description": "API gratuita para consultar agencias Shalom en tiempo real. Encuentra ubicaciones, horarios y servicios de todas las agencias Shalom.",
    "url": "https://shalom-api.wazend.net",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Wazend"
    },
    "keywords": "Shalom, shalom api, shalom api agencias, shalom agencias, API agencias, ubicaciones Shalom, horarios agencias, servicios Shalom"
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
