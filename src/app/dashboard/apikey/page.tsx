'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import Loader from '../../components/Loader';
import { toast } from 'sonner';

export default function ApiKeyPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(storedUser);
        const res = await fetch(`/api/users/${user.id}/dashboard`);

        if (!res.ok) {
          throw new Error('Error al cargar datos');
        }

        const dashboardData = await res.json();
        setData(dashboardData);
      } catch (err: any) {
        toast.error('Error al cargar datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const copyToClipboard = () => {
    if (data?.apiKey) {
      navigator.clipboard.writeText(data.apiKey);
      setCopied(true);
      toast.success('API Key copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <Loader message="Cargando tu API Key..." />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">No se pudieron cargar los datos de la API Key.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">API Key</h1>

      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Tu API Key Personal
          </h3>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 flex items-center justify-between">
            <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
              {data.apiKey || 'No tienes una API Key activa'}
            </code>

            {data.apiKey && (
              <button
                onClick={copyToClipboard}
                className="ml-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                title="Copiar API Key"
              >
                {copied ? (
                  <ClipboardDocumentCheckIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <ClipboardDocumentIcon className="h-6 w-6" />
                )}
              </button>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Esta es tu llave de acceso para realizar consultas a la API. Mantenla segura y no la compartas públicamente.
          </p>

          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Ejemplo de uso
            </h4>
            <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
              <pre className="text-sm text-gray-100">
                {`curl -X GET "https://shalom-api.live/api/agencia" \\
  -H "x-api-key: ${data.apiKey || 'TU_API_KEY'}"`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
