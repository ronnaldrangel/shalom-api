export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-3xl font-bold text-white">API Documentation</h1>
            <p className="text-blue-100 mt-2">Documentación completa de la API de Shalom</p>
          </div>

          <div className="p-6">
            {/* Autenticación */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔐 Autenticación</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>API Key Maestra:</strong> <code className="bg-yellow-200 px-2 py-1 rounded">shalom-api-key-20242</code>
                </p>
                <p className="text-yellow-800 mt-2">
                  Esta API key permite acceso completo a todas las rutas sin restricciones de rate limiting.
                </p>
              </div>
              <p className="text-gray-900 mb-4">
                Todas las rutas (excepto <code>/api/agencias-server</code>) requieren autenticación mediante API key.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Métodos de autenticación:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><strong>Header x-api-key:</strong> <code>x-api-key: tu-api-key</code></li>
                  <li><strong>Authorization Bearer:</strong> <code>Authorization: Bearer tu-api-key</code></li>
                </ul>
              </div>
            </section>

            {/* Rutas API */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">📋 Rutas API.</h2>



              {/* /api/listar */}
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">GET</span>
                    /api/listar
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-900 mb-3">Lista todas las agencias (requiere autenticación).</p>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <h4 className="font-semibold mb-2">Headers requeridos:</h4>
                    <code>x-api-key: tu-api-key</code>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <h4 className="font-semibold mb-2">Respuesta:</h4>
                    <p className="text-sm text-gray-900">Misma estructura que /api/agencias-server</p>
                  </div>
                </div>
              </div>

              {/* /api/agencia */}
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">GET</span>
                    /api/agencia
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-900 mb-3">Busca agencias por nombre.</p>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <h4 className="font-semibold mb-2">Parámetros:</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li><code>q</code> (requerido): Término de búsqueda para el nombre de la agencia</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <h4 className="font-semibold mb-2">Headers requeridos:</h4>
                    <code>x-api-key: tu-api-key</code>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <h4 className="font-semibold mb-2">Ejemplo de respuesta:</h4>
                    <pre className="text-sm overflow-x-auto">
{`{
  "query": "central",
  "campo_busqueda": "nombre",
  "total": 1,
  "resultados": [
    {
      "ter_id": "001",
      "nombre": "Agencia Central",
      // ... resto de campos
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* /api/buscar */}
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">GET</span>
                    /api/buscar
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-900 mb-3">Búsqueda avanzada en múltiples campos de agencias.</p>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <h4 className="font-semibold mb-2">Headers requeridos:</h4>
                    <code>x-api-key: tu-api-key</code>
                  </div>
                  <p className="text-sm text-gray-900">Permite búsqueda en nombre, dirección, provincia, departamento, etc.</p>
                </div>
              </div>

              {/* /api/image */}
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">GET</span>
                    /api/image
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-900 mb-3">Genera imágenes SVG con información de agencias.</p>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <h4 className="font-semibold mb-2">Parámetros:</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li><code>query</code> o <code>q</code> (requerido): Término de búsqueda</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <h4 className="font-semibold mb-2">Headers requeridos:</h4>
                    <code>x-api-key: tu-api-key</code>
                  </div>
                  <p className="text-sm text-gray-900">Retorna una imagen SVG con los resultados de búsqueda.</p>
                </div>
              </div>



              {/* /api/users */}
              <div className="border border-gray-200 rounded-lg mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">GET</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">POST</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm mr-2">PATCH</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm mr-2">DELETE</span>
                    /api/users
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-900 mb-3">Gestión de usuarios. Los usuarios pueden tener múltiples API keys, pero el límite de consumo mensual se aplica por usuario.</p>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <h4 className="font-semibold mb-2">Headers requeridos:</h4>
                    <code>x-api-key: shalom-api-key-20242</code> (solo API key maestra)
                  </div>
                  <div className="bg-yellow-50 p-3 rounded mb-3">
                    <h4 className="font-semibold mb-2">⚠️ Importante:</h4>
                    <p className="text-sm text-gray-900">Los usuarios pueden tener múltiples API keys, pero el límite de consumo se aplica por usuario, no por API key individual.</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">POST - Crear usuario:</h4>
                      <pre className="text-sm bg-gray-100 p-2 rounded mt-1">
{`{
  "email": "usuario@ejemplo.com",
  "name": "Nombre Usuario"
}`}
                      </pre>
                      <p className="text-xs text-gray-600 mt-1">Crea automáticamente una API key única para el usuario</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">GET - Listar usuarios:</h4>
                      <p className="text-sm text-gray-900">Retorna todos los usuarios con sus API keys</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">PATCH - Gestionar API keys del usuario:</h4>
                      <div className="space-y-2 mt-1">
                        <div>
                          <p className="text-xs font-medium">Crear API key:</p>
                          <pre className="text-sm bg-gray-100 p-2 rounded">
{`{
  "action": "create",
  "userId": "user-id",
  "name": "Nombre de la API key"
}`}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs font-medium">Actualizar API key:</p>
                          <pre className="text-sm bg-gray-100 p-2 rounded">
{`{
  "action": "update",
  "apiKeyId": "api-key-id",
  "name": "Nuevo nombre",
  "isActive": false
}`}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs font-medium">Eliminar API key:</p>
                          <pre className="text-sm bg-gray-100 p-2 rounded">
{`{
  "action": "delete",
  "apiKeyId": "api-key-id"
}`}
                          </pre>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">El límite de consumo es por usuario, no por API key individual</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">DELETE - Eliminar usuario:</h4>
                      <p className="text-sm text-gray-900">Parámetros: <code>userId</code> o <code>email</code></p>
                      <p className="text-xs text-gray-600 mt-1">Elimina automáticamente al usuario y todas sus API keys</p>
                    </div>
                  </div>
                </div>
              </div>


            </section>

            {/* Códigos de respuesta */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Códigos de Respuesta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Códigos de Éxito</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li><strong>200:</strong> Solicitud exitosa</li>
                    <li><strong>201:</strong> Recurso creado exitosamente</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">❌ Códigos de Error</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li><strong>400:</strong> Solicitud incorrecta</li>
                    <li><strong>401:</strong> No autorizado (API key inválida)</li>
                    <li><strong>404:</strong> Recurso no encontrado</li>
                    <li><strong>409:</strong> Conflicto (recurso ya existe)</li>
                    <li><strong>429:</strong> Límite de rate excedido</li>
                    <li><strong>500:</strong> Error interno del servidor</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Rate Limiting */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">⏱️ Rate Limiting</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="text-blue-800 space-y-2">
                  <li>• <strong>API Key Maestra:</strong> Sin límites de rate</li>
                  <li>• <strong>API Keys de Usuario:</strong> Límite mensual configurable (por defecto 5000 consultas)</li>
                  <li>• <strong>Headers de respuesta:</strong> Incluyen información sobre límites restantes</li>
                </ul>
              </div>
            </section>

            {/* Ejemplos de uso */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">💡 Ejemplos de Uso</h2>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Buscar agencias con curl:</h3>
                  <pre className="text-sm overflow-x-auto">
{`curl -H "x-api-key: tu-api-key" \
     "https://tu-dominio.com/api/agencia?q=central"`}
                  </pre>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Crear usuario con JavaScript:</h3>
                  <pre className="text-sm overflow-x-auto">
{`fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'shalom-api-key-20242'
  },
  body: JSON.stringify({
    email: 'nuevo@usuario.com',
    name: 'Nuevo Usuario'
  })
})`}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}