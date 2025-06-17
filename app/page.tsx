'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SystemInfoCard } from '@/components/dashboard/SystemInfoCard';
import SystemStatus from '@/components/dashboard/SystemStatus';
import { FeatureCards } from '@/components/dashboard/FeatureCards';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onLogout={handleLogout} user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lewa kolumna - Informacje systemowe */}
          <div className="lg:col-span-2 space-y-6">
            <SystemInfoCard />
            <SystemStatus />
          </div>

          {/* Prawa kolumna - Szybkie akcje */}
          <div className="space-y-6">
            <FeatureCards />
            
            {/* Informacje o użytkowniku */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('auth.userDetails')}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.email')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('users.role')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.role}</p>
                </div>
                {user.company && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('users.company')}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.company.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 