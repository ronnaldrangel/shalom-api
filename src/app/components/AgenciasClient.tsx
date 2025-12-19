'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface Agencia {
  ter_id: number;
  ter_abrebiatura: string;
  zona: string;
  ter_zona: string;
  provincia: string;
  departamento: string;
  lugar: string;
  latitud: string;
  longitud: string;
  sp: string;
  imagen: string;
  direccion: string;
  telefono: string;
  hora_atencion: string;
  hora_domingo: string;
  hora_entrega: string | null;
  detalles: string;
  estadoAgencia: string;
  nombre: string;
  lugar_over: string;
  ter_tipo_destino: string;
  ter_tipo_conexion: string | null;
  ter_estado_agente: string;
  ter_reparto_habilitado: string;
  ter_habilitado_OS: number;
  origen: number;
  destino: number;
  ter_aereo: number;
  ter_estado_pro: string;
  ter_principal: number;
  ter_internacional: number;
  dep_id: number;
  prov_id: number;
  dist_id: number;
  ubi_id: number;
  origenes_aereos: unknown[];
  destinos_aereos: number[];
}

interface AgenciasClientProps {
  initialAgencias: Agencia[];
  lastUpdated: string;
}

export default function AgenciasClient({ initialAgencias, lastUpdated }: AgenciasClientProps) {
  const [agencias] = useState<Agencia[]>(initialAgencias);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMinimalMode, setIsMinimalMode] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Cargar estado del localStorage después del montaje
    const saved = localStorage.getItem('isMinimalMode');
    if (saved !== null) {
      setIsMinimalMode(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('isMinimalMode', JSON.stringify(isMinimalMode));
    }
  }, [isMinimalMode, isClient]);

  const filteredAgencias = agencias.filter(agencia => {
    // Filtrar agencias que tengan ter_habilitado_OS = 0
    if (agencia.ter_habilitado_OS === 0) return false;

    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      agencia.zona?.toLowerCase().includes(searchLower) ||
      agencia.nombre?.toLowerCase().includes(searchLower) ||
      agencia.direccion?.toLowerCase().includes(searchLower) ||
      agencia.provincia?.toLowerCase().includes(searchLower) ||
      agencia.departamento?.toLowerCase().includes(searchLower) ||
      agencia.lugar?.toLowerCase().includes(searchLower) ||
      agencia.ter_abrebiatura?.toLowerCase().includes(searchLower)
    );
  });

  const renderContent = () => {
    if (filteredAgencias.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No se encontraron agencias</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Limpiar búsqueda
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
        {filteredAgencias.map((agencia) => (
          <div key={agencia.ter_id} className="bg-white rounded-lg shadow-sm transition-shadow border">
            {isMinimalMode ? (
              /* Vista Minimal */
              <div className="p-2 md:p-4 group">
                <div className="flex items-center">
                  <MapPinIcon className="w-10 h-auto text-red-600 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-md font-semibold text-gray-900 capitalize">
                      {agencia.lugar_over.toLowerCase()}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize truncate">
                      {agencia.direccion.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Vista Completa */
              <>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <MapPinIcon className="w-10 h-auto text-red-600 mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                        {agencia.lugar_over.toLowerCase()}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 capitalize">
                        {agencia.nombre.toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-400 mb-2 capitalize">
                        {agencia.direccion.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start mb-6">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${agencia.latitud},${agencia.longitud}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-red-600 font-semibold underline decoration-red-600"
                    >
                      <ArrowRightCircleIcon className="w-4 h-4 mr-2" />
                      Como llegar
                    </a>
                  </div>

                  {/* Horarios */}
                  <div className="mb-2">
                    <div className="flex items-center text-sm text-gray-500 font-semibold mb-1">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      {agencia.hora_atencion}
                    </div>
                    {agencia.hora_domingo && (
                      <div className="flex items-center text-sm text-gray-500 font-semibold">
                        <ClockIcon className="w-4 h-4 mr-2 text-white" />
                        {agencia.hora_domingo}
                      </div>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500 font-semibold">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      {agencia.telefono}
                    </div>
                  </div>
                </div>

                {/* Botón Ver tarifas */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => {
                      window.open(
                        `https://servicesweb.shalomcontrol.com/api/v1/web/tarifa/pdf/${encodeURIComponent(agencia.ter_id)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Ver tarifas
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="shadow-sm border-b" style={{ backgroundColor: '#ee2a2f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl font-bold text-white">Shalom | Shalom API | Shalom Agencias</h1>
              <p className="text-red-100 mt-1 text-sm md:text-base">
                API oficial Shalom - Consulta todas las agencias Shalom en tiempo real. Encuentra ubicaciones, horarios y servicios de agencias Shalom.
              </p>
              <p className="text-red-100 mt-1 text-xs md:text-sm">
                {filteredAgencias.length} de {agencias.length} agencias disponibles
                <span className="ml-2">
                  • Actualizado: {new Date(lastUpdated).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-white hover:text-red-100 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white text-sm text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                Registro
              </Link>
              <Link
                href="/docs"
                className="bg-red-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                📚 Documentación
              </Link>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-white">
                  Vista Minimal
                </span>
                <button
                  onClick={() => setIsMinimalMode(!isMinimalMode)}
                  suppressHydrationWarning
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isMinimalMode ? 'bg-white' : 'bg-red-800'
                    }`}
                >
                  <span
                    suppressHydrationWarning
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${isMinimalMode ? 'translate-x-6 bg-red-600' : 'translate-x-1 bg-white'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Buscador */}
      <section className="bg-white shadow-sm border-b" aria-label="Búsqueda de agencias">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="sr-only">Buscar agencias Shalom - Shalom API</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar agencias Shalom por zona, nombre, dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-black"
                aria-label="Buscar agencias Shalom por zona, nombre o dirección - Shalom API"
                aria-describedby="search-description"
              />
              <div id="search-description" className="sr-only">
                Busca entre {agencias.length} agencias Shalom disponibles con Shalom API
              </div>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        <h2 className="sr-only">Resultados de agencias Shalom</h2>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Shalom API oficial - Consulta agencias Shalom en tiempo real | Shalom agencias con ubicaciones y horarios
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> | </span>
              Desarrollado por <a href="https://wazend.net/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-600 transition-colors">Wazend</a>
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
              <span className="bg-gray-50 px-2 py-1 rounded">Shalom API</span>
              <span className="bg-gray-50 px-2 py-1 rounded">Agencias Shalom</span>
              <span className="bg-gray-50 px-2 py-1 rounded">Tiempo Real</span>
              <span className="bg-gray-50 px-2 py-1 rounded">API Gratuita</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}