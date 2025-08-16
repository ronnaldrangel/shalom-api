import Link from 'next/link';
import { getAgenciasData } from '@/lib/agencias-data';
import AgenciasClient from './components/AgenciasClient';

export default async function AgenciasPage() {
  // Obtener datos directamente en el servidor
  const agenciasData = await getAgenciasData();
  
  // Si hay error, mostrar página de error
  if (!agenciasData.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{agenciasData.message}</p>
          <Link 
            href="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }
  
  const lastUpdated = new Date().toISOString();

  return (
    <AgenciasClient 
      initialAgencias={agenciasData.data} 
      lastUpdated={lastUpdated}
    />
  );
}