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
  origenes_aereos: any[];
  destinos_aereos: number[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Agencia[];
}

export default function AgenciasPage() {
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMinimalMode, setIsMinimalMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isMinimalMode');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    fetchAgencias();
  }, []);

  const fetchAgencias = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/listar');
      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setAgencias(data.data);
        setLastUpdated(new Date().toISOString()); // Ya no tenemos lastUpdated de la API
      } else {
        setError('No se pudieron cargar las agencias');
      }
    } catch (err) {
      setError('Error al cargar las agencias');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string | null) => {
    if (estado && estado.includes('ATENDIENDO')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando agencias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ {error}</div>
          <button
            onClick={fetchAgencias}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="shadow-sm border-b" style={{ backgroundColor: '#ee2a2f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">ShalomAPI</h1>
              <p className="text-red-100 mt-1">
                {filteredAgencias.length} de {agencias.length} agencias
                {lastUpdated && (
                  <span className="ml-2 text-sm">
                    • Última actualización: {new Date(lastUpdated).toLocaleString('es-ES')}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/docs"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                📚 Documentación
              </Link>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-white">
                  Vista Minimal
                </span>
                <button
                  onClick={() => {
                    const newMode = !isMinimalMode;
                    setIsMinimalMode(newMode);
                    localStorage.setItem('isMinimalMode', JSON.stringify(newMode));
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isMinimalMode ? 'bg-white' : 'bg-red-800'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${isMinimalMode ? 'translate-x-6 bg-red-600' : 'translate-x-1 bg-white'
                      }`}
                  />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por zona, nombre, dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-black"
              />
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
      </div>

      {/* Grid de agencias */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAgencias.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron agencias</h3>
            <p className="mt-1 text-sm text-gray-500">
              No hay agencias que coincidan con "<span className="font-medium">{searchTerm}</span>"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgencias.map((agencia) => (
              <div key={agencia.ter_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                {isMinimalMode ? (
                  /* Vista Minimal */

                  <div className="p-4 group">
                    <div className="flex items-center">
                      <MapPinIcon className="w-10 h-auto text-red-600 mr-3 flex-shrink-0" />

                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 capitalize">
                          {agencia.lugar_over.toLowerCase()}
                        </h3>

                        <p className="text-sm text-gray-600 capitalize truncate w-52">
                          {agencia.direccion.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                ) : (
                  /* Vista Completa */
                  <>
                    <div className="p-6">
                      <MapPinIcon className="w-10 h-auto text-red-600 mb-3" />

                      <div className="flex items-start mb-6">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 uppercase">
                            {agencia.lugar_over.toLowerCase()}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1 capitalize">
                            {agencia.nombre.toLowerCase()}
                          </p>
                          <p className="text-sm text-gray-400 capitalize">
                            {agencia.direccion.toLowerCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start mb-6">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            agencia.direccion + ', ' + agencia.provincia + ', ' + agencia.departamento
                          )}`}
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
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            Datos sincronizados automáticamente cada 24 horas desde la API de Shalom Control
          </div>
        </div>
      </div>
    </div>
  );
}