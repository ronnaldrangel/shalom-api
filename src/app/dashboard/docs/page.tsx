'use client';

import { useState } from 'react';
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  ServerIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const endpoints = [
    {
      id: 'listar',
      title: 'Listar Agencias',
      method: 'GET',
      path: '/api/listar',
      description: 'Obtiene el listado completo de todas las agencias disponibles.',
      icon: ListBulletIcon,
      params: [],
      example: {
        request: `curl -X GET "https://app.shalom-api.com/api/listar" \\
  -H "x-api-key: TU_API_KEY"`,
        response: `{
  "data": [
    {
      "ter_id": "1",
      "nombre": "AGENCIA LIMA",
      "direccion": "Av. Principal 123",
      ...
    }
  ]
}`
      }
    },
    {
      id: 'buscar',
      title: 'Buscar Agencias',
      method: 'GET',
      path: '/api/buscar',
      description: 'Busca agencias que coincidan con el término proporcionado en cualquier campo relevante.',
      icon: MagnifyingGlassIcon,
      params: [
        { name: 'q', type: 'string', required: true, description: 'Término de búsqueda' }
      ],
      example: {
        request: `curl -X GET "https://app.shalom-api.com/api/buscar?q=lima" \\
  -H "x-api-key: TU_API_KEY"`,
        response: `{
  "success": true,
  "total": 5,
  "data": [...]
}`
      }
    },
    {
      id: 'nombre',
      title: 'Buscar por Nombre',
      method: 'GET',
      path: '/api/nombre',
      description: 'Busca agencias filtrando específicamente por el nombre.',
      icon: ServerIcon,
      params: [
        { name: 'q', type: 'string', required: true, description: 'Nombre de la agencia a buscar' }
      ],
      example: {
        request: `curl -X GET "https://app.shalom-api.com/api/nombre?q=miraflores" \\
  -H "x-api-key: TU_API_KEY"`,
        response: `{
  "success": true,
  "total": 1,
  "query": "miraflores",
  "data": [...]
}`
      }
    },
    {
      id: 'image',
      title: 'Generar Imagen',
      method: 'GET',
      path: '/api/image',
      description: 'Genera una imagen PNG con la información de las agencias encontradas.',
      icon: PhotoIcon,
      params: [
        { name: 'q', type: 'string', required: true, description: 'Término de búsqueda para generar la imagen' }
      ],
      example: {
        request: `curl -X GET "https://app.shalom-api.com/api/image?q=arequipa" \\
  -H "x-api-key: TU_API_KEY" --output agencias.png`,
        response: `[Binary PNG Data]`
      }
    }
  ];

  return (
    <div className="py-2 space-y-8">

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Documentación de la API</h1>

      <div className="space-y-12">
        {/* Authentication Section */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            Autenticación
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Todas las peticiones a la API deben incluir tu API Key en los headers.
          </p>
          <div className="bg-gray-900 rounded-md p-4 overflow-x-auto relative group">
            <code className="text-sm text-gray-300 font-mono">
              x-api-key: YOUR_API_KEY
            </code>
          </div>
        </section>

        {/* Endpoints List */}
        <div className="space-y-8">
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-start gap-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <endpoint.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {endpoint.title}
                    </h3>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${endpoint.method === 'GET'
                      ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30'
                      : 'bg-green-50 text-green-700 ring-green-600/20'
                      }`}>
                      {endpoint.method}
                    </span>
                  </div>
                  <code className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                  <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
                    {endpoint.description}
                  </p>
                </div>
              </div>

              {endpoint.params.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Parámetros</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requerido</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {endpoint.params.map((param) => (
                          <tr key={param.name}>
                            <td className="px-3 py-2 text-sm font-mono text-indigo-600 dark:text-indigo-400">{param.name}</td>
                            <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{param.type}</td>
                            <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {param.required ? (
                                <span className="text-red-600 dark:text-red-400 text-xs font-bold">SÍ</span>
                              ) : (
                                <span className="text-gray-400 text-xs">NO</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Ejemplo de Solicitud</h4>
                    <button
                      onClick={() => copyToClipboard(endpoint.example.request, `${endpoint.id}-req`)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Copiar"
                    >
                      {copied === `${endpoint.id}-req` ? (
                        <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <ClipboardDocumentIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                    <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                      {endpoint.example.request}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Respuesta Ejemplo</h4>
                    <button
                      onClick={() => copyToClipboard(endpoint.example.response, `${endpoint.id}-res`)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Copiar"
                    >
                      {copied === `${endpoint.id}-res` ? (
                        <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <ClipboardDocumentIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-md p-4 overflow-x-auto max-h-[200px] overflow-y-auto custom-scrollbar">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                      {endpoint.example.response}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
