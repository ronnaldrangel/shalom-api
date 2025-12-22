import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "@/lib/init"; // Inicializar servicios de la aplicación

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shalom | Shalom API | Shalom Agencias - API Oficial de Agencias Shalom",
  description: "Shalom API oficial - Consulta todas las agencias Shalom en tiempo real. Shalom agencias con ubicaciones, horarios y servicios. API gratuita Shalom para desarrolladores. Encuentra tu agencia Shalom más cercana.",
  keywords: [
    "Shalom",
    "shalom api",
    "shalom agencias",
    "agencias shalom",
    "API shalom",
    "shalom api agencias",
    "shalom ubicaciones",
    "shalom horarios",
    "shalom servicios",
    "API agencias",
    "consulta agencias shalom",
    "agencias Shalom Peru",
    "shalom lima",
    "shalom API gratuita",
    "directorio agencias shalom"
  ],
  authors: [{ name: "Wazend" }],
  creator: "Wazend",
  publisher: "Wazend",
  robots: "index, follow",
  openGraph: {
    title: "Shalom | Shalom API | Shalom Agencias - Consulta Agencias en Tiempo Real",
    description: "Shalom API oficial para consultar todas las agencias Shalom. Encuentra ubicaciones, horarios y servicios de agencias Shalom en tiempo real. API gratuita.",
    type: "website",
    locale: "es_ES",
    siteName: "Shalom API",
    images: [
      {
        url: "/cover.png",
        width: 1200,
        height: 630,
        alt: "Shalom API - Consulta Agencias Shalom en Tiempo Real"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Shalom | Shalom API | Shalom Agencias",
    description: "API oficial Shalom - Consulta agencias Shalom en tiempo real. Ubicaciones, horarios y servicios de todas las agencias Shalom.",
    images: ["/cover.png"]
  },
  alternates: {
    canonical: "https://shalom-api.live"
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  }
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Shalom API - API Oficial de Agencias Shalom",
    "description": "Shalom API oficial para consultar todas las agencias Shalom en tiempo real. Encuentra ubicaciones, horarios y servicios de agencias Shalom. API gratuita para desarrolladores.",
    "url": "https://shalom-api.live",
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
    "keywords": "Shalom, shalom api, shalom agencias, agencias shalom, API shalom, shalom api agencias, shalom ubicaciones, shalom horarios, shalom servicios, consulta agencias shalom, agencias Shalom Peru, shalom lima"
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
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
