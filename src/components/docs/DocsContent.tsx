'use client';

import {
    CodeBracketIcon,
    DocumentTextIcon,
    ServerIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';

interface DocsContentProps {
    showTitle?: boolean;
}

export default function DocsContent({ showTitle = true }: DocsContentProps) {
    return (
        <div className="space-y-8">
            {/* Introducción */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <DocumentTextIcon className="w-6 h-6 mr-2 text-red-600" />
                    Introducción
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Shalom API es una aplicación web que sincroniza y muestra información de agencias de Shalom.
                    Proporciona una interfaz web intuitiva para visualizar las agencias y endpoints API para integración.
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
                    <p className="text-red-800 dark:text-red-200">
                        <strong>Nota:</strong> La aplicación se sincroniza automáticamente cada 24 horas a las 00:00 para mantener
                        los datos actualizados.
                    </p>
                </div>
            </div>

            {/* Autenticación */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CodeBracketIcon className="w-6 h-6 mr-2 text-red-600" />
                    Autenticación
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Todas las rutas de la API requieren autenticación mediante API key para garantizar la seguridad.
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-yellow-800 dark:text-yellow-200">
                        <strong>API Key:</strong> <code>[************]</code>
                        <Link
                            href="/auth/login"
                            className="ml-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-2 py-1 rounded transition-colors"
                        >
                            Solicitar Acceso
                        </Link>
                    </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Métodos de autenticación</h3>

                <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Header x-api-key</h4>
                        <pre className="bg-gray-100 dark:bg-black p-3 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
                            <code>{`curl -H "x-api-key: $API_KEY" \
   https://shalom-api.lat/api/listar`}</code>
                        </pre>
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mt-4">
                    <p className="text-red-800 dark:text-red-200">
                        <strong>Error 401:</strong> Si no incluyes la API key o es incorrecta, recibirás un error de autenticación.
                    </p>
                </div>
            </div>

            {/* Funcionalidades */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <ServerIcon className="w-6 h-6 mr-2 text-red-600" />
                    Funcionalidades Principales
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Interfaz Web */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🏢 Interfaz Web</h3>
                        <code className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-2 py-1 rounded text-sm font-mono">/</code>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Página principal que muestra todas las agencias en tarjetas interactivas con:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                            <li>Información de ubicación y contacto</li>
                            <li>Horarios de atención</li>
                            <li>Botón &quot;Cómo llegar&quot; integrado con Google Maps</li>
                            <li>Búsqueda en tiempo real</li>
                            <li>Diseño responsive</li>
                        </ul>
                    </div>

                    {/* API JSON */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📋 API JSON</h3>
                        <code className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm font-mono">GET /api/listar</code>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Endpoint que devuelve la lista completa de agencias en formato JSON.
                        </p>
                        <div className="mt-2">
                            <a
                                href="/api/listar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 underline text-sm"
                            >
                                Ver ejemplo de respuesta →
                            </a>
                        </div>
                    </div>

                    {/* API de Búsqueda */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🔍 API de Búsqueda</h3>
                        <code className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-mono">GET /api/buscar?q=término</code>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Busca agencias por cualquier campo (nombre, dirección, teléfono, horarios, etc.).
                        </p>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ejemplos:</p>
                            <div className="space-y-1">
                                <a
                                    href="/api/buscar?q=lima"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-sm font-mono"
                                >
                                    /api/buscar?q=lima
                                </a>
                                <a
                                    href="/api/buscar?q=centro"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-sm font-mono"
                                >
                                    /api/buscar?q=centro
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* API de Búsqueda por Nombre */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🏢 API de Búsqueda por Nombre</h3>
                        <code className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-mono">GET /api/agencia?q=término</code>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Busca agencias únicamente por el campo (nombre). Ideal para búsquedas específicas de agencias.
                        </p>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ejemplos:</p>
                            <div className="space-y-1">
                                <a
                                    href="/api/agencia?q=lima"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline text-sm font-mono"
                                >
                                    /api/agencia?q=lima
                                </a>
                                <a
                                    href="/api/agencia?q=centro"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline text-sm font-mono"
                                >
                                    /api/agencia?q=centro
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* API de Imagen */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🖼️ API de Imagen (Vista Compacta)</h3>
                        <code className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm font-mono">GET /api/image?q=término</code>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Genera una imagen PNG dinámica con los resultados de búsqueda en formato de 2 columnas. Muestra lugar_over como título y dirección truncada y capitalizada. Ideal para embeds, previews y compartir en redes sociales.
                        </p>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ejemplos:</p>
                            <div className="space-y-1">
                                <a
                                    href="/api/image?q=lima"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 underline text-sm font-mono"
                                >
                                    /api/image?q=lima
                                </a>
                                <a
                                    href="/api/image?q=centro"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 underline text-sm font-mono"
                                >
                                    /api/image?q=centro
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* API de Tracking */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📦 API de Tracking</h3>
                        <code className="bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-sm font-mono">POST /api/track</code>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Permite realizar el seguimiento de un pedido utilizando el número de orden y el código de orden.
                        </p>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ejemplo de Body (JSON):</p>
                            <pre className="bg-gray-100 dark:bg-black p-3 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
                                {`{
  "orderNumber": "66479331",
  "orderCode": "3KTH"
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estructura de Datos */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CodeBracketIcon className="w-6 h-6 mr-2 text-red-600" />
                    Estructura de Datos
                </h2>

                {/* Estructura de Agencia */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📋 Estructura de Agencia</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Cada agencia contiene la siguiente información:
                    </p>
                    <div className="bg-gray-50 dark:bg-black rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-800 dark:text-gray-200">
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🔍 Respuesta de API de Búsqueda</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        La API de búsqueda devuelve un objeto con la siguiente estructura:
                    </p>
                    <div className="bg-gray-50 dark:bg-black rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-800 dark:text-gray-200">
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
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                            <strong>Nota:</strong> La búsqueda es case-insensitive y busca en todos los campos de texto de la agencia.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
