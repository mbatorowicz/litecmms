'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import SystemStatus from '@/components/dashboard/SystemStatus';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Przekierowanie do login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                LiteCMMS v2.0
              </h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <button 
                onClick={() => {
                  // Logout funkcjonalność będzie dodana później
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            {/* Status systemu */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Status Systemu
                </h3>
                <SystemStatus />
              </div>
            </div>

            {/* Informacje o użytkowniku */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Witaj w LiteCMMS v2.0!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Informacje o użytkowniku</h4>
                    <dl className="mt-2 space-y-1">
                      <div>
                        <dt className="text-sm text-gray-500">Email:</dt>
                        <dd className="text-sm text-gray-900">{user.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Nazwa użytkownika:</dt>
                        <dd className="text-sm text-gray-900">{user.username}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Rola:</dt>
                        <dd className="text-sm text-gray-900">{user.role}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Informacje o firmie</h4>
                    <dl className="mt-2 space-y-1">
                      <div>
                        <dt className="text-sm text-gray-500">Nazwa firmy:</dt>
                        <dd className="text-sm text-gray-900">{user.company?.name || 'Brak danych'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Lokalizacje:</dt>
                        <dd className="text-sm text-gray-900">
                          {user.locations?.length || 0} lokalizacji
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Szybkie akcje */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Szybkie akcje
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <h4 className="font-medium text-gray-900">Maszyny</h4>
                    <p className="text-sm text-gray-500 mt-1">Zarządzaj maszynami</p>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <h4 className="font-medium text-gray-900">Zlecenia</h4>
                    <p className="text-sm text-gray-500 mt-1">Zarządzaj zleceniami pracy</p>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <h4 className="font-medium text-gray-900">Części</h4>
                    <p className="text-sm text-gray-500 mt-1">Zarządzaj magazynem części</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 