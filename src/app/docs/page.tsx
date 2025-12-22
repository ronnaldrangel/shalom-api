'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import DocsContent from '../../components/docs/DocsContent';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header
        title="Documentación - Shalom API"
        description="Guía completa para usar la API de agencias Shalom - Endpoints, ejemplos y mejores prácticas"
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="main">
        <DocsContent />
      </main>
      <Footer />
    </div>
  );
}
