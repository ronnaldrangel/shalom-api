'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  TrashIcon,
  PencilIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  KeyIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Loader from '../components/Loader';

interface ApiKey {
  key: string;
  isActive: boolean;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  monthlyLimit: number;
  currentUsage: number;
  remaining: number;
  createdAt: string;
  isVerified: boolean;
  apiKeys: ApiKey[];
  _count: {
    apiKeys: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState<number>(0);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      const res = await fetch('/api/admin/users', {
        headers: {
          'x-admin-id': currentUser?.id || ''
        }
      });

      if (!res.ok) throw new Error('Error al cargar usuarios');

      const data = await res.json();
      setUsers(data.users);
    } catch {
      toast.error('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const storedUser = localStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-id': currentUser?.id || ''
        }
      });

      if (!res.ok) throw new Error('Error al eliminar');

      setUsers(users.filter(u => u.id !== userId));
      toast.success('Usuario eliminado');
    } catch {
      toast.error('Error al eliminar usuario');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateUser = async (userId: string, data: any) => {
    try {
      const storedUser = localStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': currentUser?.id || ''
        },
        body: JSON.stringify({ userId, ...data })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      await res.json();

      setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u));
      setEditingUser(null);
      toast.success('Usuario actualizado correctamente');
    } catch {
      toast.error('Error al actualizar usuario');
    }
  };

  const toggleRole = (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (confirm(`¿Cambiar rol de ${user.email} a ${newRole}?`)) {
      handleUpdateUser(user.id, { role: newRole });
    }
  };

  const toggleVerification = (user: User) => {
    const newStatus = !user.isVerified;
    if (confirm(`¿${newStatus ? 'Verificar' : 'Desverificar'} usuario ${user.email}?`)) {
      handleUpdateUser(user.id, { isVerified: newStatus });
    }
  };

  const resetUsage = async (user: User) => {
    if (confirm(`¿Resetear consumo mensual de ${user.email}?`)) {
      handleUpdateUser(user.id, { resetUsage: true });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader message="Cargando usuarios..." /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
        </div>
        <div className="text-sm text-gray-500">
          Total usuarios: {users.length}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Usuario</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Rol</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Límite Mensual</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Consultas Restantes</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Estado</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">API Key</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{user.name || 'Sin nombre'}</div>
                    <div className="text-xs text-gray-500 font-mono">{user.id}</div>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleRole(user)}
                      className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                        }`}
                      title="Click para cambiar rol"
                    >
                      {user.role}
                    </button>
                  </td>
                  <td className="p-4">
                    {editingUser === user.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border rounded bg-transparent dark:border-gray-600"
                          value={newLimit}
                          onChange={(e) => setNewLimit(parseInt(e.target.value) || 0)}
                        />
                        <button
                          onClick={() => handleUpdateUser(user.id, { monthlyLimit: newLimit })}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{user.monthlyLimit}</span>
                        <button
                          onClick={() => {
                            setEditingUser(user.id);
                            setNewLimit(user.monthlyLimit);
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          title="Editar límite"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => resetUsage(user)}
                          className="text-gray-400 hover:text-orange-500 transition-colors"
                          title="Resetear consumo mensual"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.remaining}</span>
                      <span className="text-xs text-gray-500">/ {user.monthlyLimit}</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${(user.remaining / user.monthlyLimit) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleVerification(user)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${user.isVerified
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                        }`}
                      title="Click para cambiar estado"
                    >
                      <ShieldCheckIcon className="w-3 h-3" />
                      {user.isVerified ? 'Verificado' : 'Pendiente'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {showApiKey === user.id ? (
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-xs font-mono">
                            {user.apiKeys?.[0]?.key || 'Sin API Key'}
                          </code>
                          <button
                            onClick={() => setShowApiKey(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowApiKey(user.id)}
                          className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 text-xs"
                          title="Ver API Key"
                        >
                          <KeyIcon className="w-4 h-4" />
                          Ver Key
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === 'admin'}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Eliminar usuario"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
