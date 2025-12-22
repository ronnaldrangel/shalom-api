'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../../components/Loader';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados separados para los dos formularios
  const [nameData, setNameData] = useState({
    name: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/auth/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setNameData({ name: userData.name || '' });
    setLoading(false);
  }, [router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameData({ ...nameData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Función para guardar solo el nombre
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: nameData.name,
          // No enviamos password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar el nombre');
      }

      // Actualizar localStorage y estado
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Nombre actualizado correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el nombre');
    }
  };

  // Función para cambiar contraseña
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Completa todos los campos');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las nuevas contraseñas no coinciden');
      return;
    }

    if (!passwordData.currentPassword) {
      toast.error('Ingresa tu contraseña actual');
      return;
    }

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar la contraseña');
      }

      toast.success('Contraseña actualizada correctamente');

      // Limpiar campos de contraseña
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar la contraseña');
    }
  };

  if (loading) {
    return <Loader message="Cargando tu perfil..." />;
  }

  return (
    <div className="py-2 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Ajustes de Perfil</h1>

      {/* Sección 1: Información Personal */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Información Personal
        </h2>

        <form onSubmit={handleNameSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">El correo electrónico no se puede cambiar.</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={nameData.name}
              onChange={handleNameChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Tu nombre"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Guardar Nombre
            </button>
          </div>
        </form>
      </div>

      {/* Sección 2: Seguridad */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Seguridad
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña Actual <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Requerido para cambiar contraseña"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nueva Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Nueva Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
