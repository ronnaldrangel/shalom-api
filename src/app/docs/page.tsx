'use client';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  CodeBracketIcon,
  DocumentTextIcon,
  ClockIcon,
  ServerIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function DocsPage() {

  const handleSync = async () => {
    try {
      const response = await fetch('/api/sync', { 
        method: 'POST',
        headers: {
          'x-api-key': 'shalom-api-key-2024'
        }
      });
      const data = await response.json();
      alert(data.message || 'Sincronización completada');
    } catch (error) {
      alert('Error al sincronizar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="shadow-sm border-b" style={{ backgroundColor: '#ee2a2f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex-1">
              <h1 className="text-xl md:text-3xl font-bold text-white">Documentación - ShalomAPI</h1>
              <p className="text-red-100 mt-1 text-sm md:text-base">
                Guía completa para usar la API de agencias Shalom - Endpoints, ejemplos y mejores prácticas
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="bg-red-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                🏢 Ver Agencias
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {/* Introducción */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-2 text-red-600" />
            Introducción
          </h2>
          <p className="text-gray-700 mb-4">
            Shalom API es una aplicación web que sincroniza y muestra información de agencias de Shalom.
            Proporciona una interfaz web intuitiva para visualizar las agencias y endpoints API para integración.
          </p>
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-800">
              <strong>Nota:</strong> La aplicación se sincroniza automáticamente cada 24 horas a las 00:00 para mantener
              los datos actualizados.
            </p>
          </div>
        </div>

        {/* Autenticación */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <CodeBracketIcon className="w-6 h-6 mr-2 text-red-600" />
            Autenticación
          </h2>
          <p className="text-gray-700 mb-4">
            Todas las rutas de la API requieren autenticación mediante API key para garantizar la seguridad.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-800">
              <strong>API Key:</strong> <code>[************]</code>
              <button
                onClick={() => {
                  const message = encodeURIComponent(
                    "Hola, me gustaría solicitar acceso al API key de ShalomAPI. Gracias!"
                  );
                  window.open(`https://wa.me/51924079147?text=${message}`, '_blank');
                }}
                className="ml-2 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded transition-colors"
              >
                Solicitar Acceso
              </button>
            </p>
          </div>

          {/* <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p className="text-blue-800">
              <strong>Configuración:</strong> La API key se configura mediante una sola variable de entorno:
            </p>
            <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
              <li><code className="bg-blue-100 px-2 py-1 rounded">API_KEY</code> - Clave unificada para toda la aplicación</li>
              <li>Se mantiene segura en el servidor y no se expone al cliente</li>
            </ul>
          </div> */}

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Métodos de autenticación</h3>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 text-black">
              <h4 className="font-semibold text-gray-900 mb-2">1. Header x-api-key</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                <code>{`curl -H "x-api-key: $API_KEY" \
   https://shalom-api.wazend.net/api/listar`}</code>
              </pre>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 text-black">
              <h4 className="font-semibold text-gray-900 mb-2">2. Authorization Bearer</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                <code>{`curl -H "Authorization: Bearer $API_KEY" \
https://shalom-api.wazend.net/api/listar`}</code>
              </pre>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
            <p className="text-red-800">
              <strong>Error 401:</strong> Si no incluyes la API key o es incorrecta, recibirás un error de autenticación.
            </p>
          </div>
        </div>

        {/* Funcionalidades */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ServerIcon className="w-6 h-6 mr-2 text-red-600" />
            Funcionalidades Principales
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Interfaz Web */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🏢 Interfaz Web</h3>
              <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">/</code>
              <p className="text-gray-600 mt-2">
                Página principal que muestra todas las agencias en tarjetas interactivas con:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Información de ubicación y contacto</li>
                <li>Horarios de atención</li>
                <li>Botón &quot;Cómo llegar&quot; integrado con Google Maps</li>
                <li>Búsqueda en tiempo real</li>
                <li>Diseño responsive</li>
              </ul>
            </div>

            {/* API JSON */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 API JSON</h3>
              <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono">GET /api/listar</code>
              <p className="text-gray-600 mt-2">
                Endpoint que devuelve la lista completa de agencias en formato JSON.
              </p>
              <div className="mt-2">
                <a
                  href="/api/listar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 underline text-sm"
                >
                  Ver ejemplo de respuesta →
                </a>
              </div>
            </div>

            {/* API de Búsqueda */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔍 API de Búsqueda</h3>
              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">GET /api/buscar?q=término</code>
              <p className="text-gray-600 mt-2">
                Busca agencias por cualquier campo (nombre, dirección, teléfono, horarios, etc.).
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">Ejemplos:</p>
                <div className="space-y-1">
                  <a
                    href="/api/buscar?q=lima"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 underline text-sm font-mono"
                  >
                    /api/buscar?q=lima
                  </a>
                  <a
                    href="/api/buscar?q=centro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 underline text-sm font-mono"
                  >
                    /api/buscar?q=centro
                  </a>
                </div>
              </div>
            </div>

            {/* API de Búsqueda por Nombre */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🏢 API de Búsqueda por Nombre</h3>
              <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET /api/agencia?q=término</code>
              <p className="text-gray-600 mt-2">
                Busca agencias únicamente por el campo (nombre). Ideal para búsquedas específicas de agencias.
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">Ejemplos:</p>
                <div className="space-y-1">
                  <a
                    href="/api/agencia?q=lima"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-green-600 hover:text-green-800 underline text-sm font-mono"
                  >
                    /api/agencia?q=lima
                  </a>
                  <a
                    href="/api/agencia?q=centro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-green-600 hover:text-green-800 underline text-sm font-mono"
                  >
                    /api/agencia?q=centro
                  </a>
                </div>
              </div>
            </div>

            {/* Cron Job */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <ClockIcon className="w-5 h-5 mr-1" />
                Sincronización Automática
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Activo:</strong> Se ejecuta automáticamente cada 24 horas a las 00:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estructura de Datos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <CodeBracketIcon className="w-6 h-6 mr-2 text-red-600" />
            Estructura de Datos
          </h2>

          {/* Estructura de Agencia */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Estructura de Agencia</h3>
            <p className="text-gray-700 mb-4">
              Cada agencia contiene la siguiente información:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">
                {`{
  "ter_id": "string",           // ID único de la agencia
  "lugar_over": "string",      // Nombre principal de la agencia
  "direccion": "string",       // Dirección completa
  "zona": "string",            // Zona de ubicación
  "provincia": "string",       // Provincia
  "departamento": "string",    // Departamento
  "telefono": "string",        // Número de teléfono
  "hora_atencion": "string",   // Horarios de lunes a sábado
  "hora_domingo": "string",    // Horarios de domingo (opcional)
  "latitud": "string",         // Coordenada de latitud
  "longitud": "string"         // Coordenada de longitud
}`}
              </pre>
            </div>
          </div>

          {/* Respuesta de Búsqueda */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔍 Respuesta de API de Búsqueda</h3>
            <p className="text-gray-700 mb-4">
              La API de búsqueda devuelve un objeto con la siguiente estructura:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">
                {`{
  "query": "string",           // Término de búsqueda utilizado
  "total": number,             // Número total de resultados
  "resultados": [              // Array de agencias encontradas
    {
      // ... estructura de agencia (ver arriba)
    }
  ]
}`}
              </pre>
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800 text-sm">
                <strong>Nota:</strong> La búsqueda es case-insensitive y busca en todos los campos de texto de la agencia.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}