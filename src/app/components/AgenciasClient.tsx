'use client';
import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';
import Footer from './Footer';
import Header from './Header';

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
          <div key={agencia.ter_id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-800 overflow-hidden group">
            {isMinimalMode ? (
              /* Vista Minimal */
              <div className="p-2 md:p-4 group">
                <div className="flex items-center">
                  <MapPinIcon className="w-10 h-auto text-red-600 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-md font-bold text-gray-900 dark:text-gray-100 capitalize">
                      {agencia.lugar_over.toLowerCase()}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize truncate">
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
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 capitalize">
                        {agencia.lugar_over.toLowerCase()}
                      </h3>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 capitalize">
                        {agencia.nombre.toLowerCase()}
                      </p>
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 capitalize">
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
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-semibold">
                      <ClockIcon className="w-4 h-4 mr-2 text-brand-red opacity-70" />
                      {agencia.hora_atencion}
                    </div>
                    {agencia.hora_domingo && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-semibold">
                        <ClockIcon className="w-4 h-4 mr-2 text-brand-red opacity-70" />
                        {agencia.hora_domingo}
                      </div>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="mb-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-semibold">
                      <PhoneIcon className="w-4 h-4 mr-2 text-brand-red opacity-70" />
                      {agencia.telefono}
                    </div>
                  </div>
                </div>


              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 font-sans">
      <Header lastUpdated={lastUpdated} />

      {/* Buscador */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-row items-center gap-2 md:gap-6 max-w-4xl mx-auto">
            <div className="relative group flex-1">
              <input
                type="text"
                placeholder="Busca agencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 md:h-14 pl-10 pr-10 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red transition-all duration-200 font-medium"
              />
              <MagnifyingGlassIcon className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                </button>
              )}
            </div>

            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 h-11 md:h-14 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <span className="text-[10px] md:text-xs font-black text-brand-red dark:text-red-400">
                    {filteredAgencias.length} <span className="hidden sm:inline">AGENCIAS</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2 md:space-x-3 bg-gray-100 dark:bg-gray-800 px-3 md:px-4 h-11 md:h-14 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <span className="text-[10px] md:text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter md:tracking-wider">COMPACTO</span>
                  <button
                    onClick={() => setIsMinimalMode(!isMinimalMode)}
                    aria-label={isMinimalMode ? "Activar vista detallada" : "Activar vista compacta"}
                    suppressHydrationWarning
                    className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red/10 ${isMinimalMode ? 'bg-brand-red' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <span
                      suppressHydrationWarning
                      className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full transition-transform duration-200 ${isMinimalMode ? 'translate-x-5 md:translate-x-6 bg-white shadow-sm' : 'translate-x-1 bg-white/90'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 min-h-[60vh]">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}