'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import Loader from '../components/Loader';
import { toast } from 'sonner';

interface DashboardData {
  user: {
    id: string;
    name: string | null;
    email: string;
    monthlyLimit: number;
  };
  usage: {
    total: number;
    remaining: number;
    limit: number;
  };
  apiKey: string | null;
  dailyStats: { date: string; count: number }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          router.push('/auth/login');
          return;
        }

        const user = JSON.parse(storedUser);
        const res = await fetch(`/api/users/${user.id}/dashboard`);

        if (!res.ok) {
          throw new Error('Error al cargar datos del dashboard');
        }

        const dashboardData = await res.json();
        setData(dashboardData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        toast.error('Error al cargar datos del dashboard: ' + message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return <Loader message="Cargando datos del dashboard..." />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">No se pudieron cargar los datos del dashboard.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Metric Card: Consultas Restantes */}
        <div className="relative group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-brand-red/5 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-20 h-20 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <div className="relative z-10">
            <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Consultas restantes
            </dt>
            <dd className="mt-4 flex items-baseline justify-between">
              <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {data.usage.remaining}
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                Activo
              </div>
            </dd>
            <div className="mt-4 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-red h-full rounded-full"
                style={{ width: `${(data.usage.remaining / data.usage.limit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric Card: Límite Mensual */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
          <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Límite mensual
          </dt>
          <dd className="mt-4 flex items-baseline">
            <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {data.usage.limit}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-400">mensual</span>
          </dd>
          <div className="mt-6 flex items-center text-sm font-semibold text-brand-red">
            <a href="https://shalom-api.com/pricing/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Explorar planes
            </a>
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Metric Card: Consultas Usadas */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
          <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Consultas usadas
          </dt>
          <dd className="mt-4 flex items-baseline">
            <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {data.usage.total}
            </div>
            <div className="ml-auto flex items-center text-xs font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
              ESTE MES
            </div>
          </dd>
          <div className="mt-6">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Uso del {((data.usage.total / data.usage.limit) * 100).toFixed(1)}% de tu cuota total.
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Consultas por Día */}
      {data.dailyStats && data.dailyStats.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Consultas por Día (Últimos 30 días)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.dailyStats}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString();
                    }}
                  />
                  <Legend />
                  <Bar name="Consultas" dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
