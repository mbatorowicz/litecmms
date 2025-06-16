'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import SystemStatus from '@/components/dashboard/SystemStatus';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SystemInfoCard } from '@/components/dashboard/SystemInfoCard';
import { useTranslation } from 'react-i18next';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Przekierowanie do login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Oryginalny DashboardHeader z przełącznikiem języka */}
        <DashboardHeader />
        
        {/* Informacje o użytkowniku w prawym górnym rogu */}
        <div className="fixed top-4 right-4 flex items-center space-x-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg px-4 py-2 z-50">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            {t('navigation.logout')}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* SystemInfoCard - oryginalny komponent */}
          <SystemInfoCard />

          {/* Status systemu */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              {t('dashboard.systemStatus')}
            </h3>
            <SystemStatus />
          </div>

          {/* Informacje o użytkowniku */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              {t('auth.userDetails')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3">
                  {t('users.userDetails')}
                </h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">{t('auth.email')}:</dt>
                    <dd className="text-sm text-slate-900 dark:text-slate-100">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">{t('users.user')}:</dt>
                    <dd className="text-sm text-slate-900 dark:text-slate-100">{user.username}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">{t('users.role')}:</dt>
                    <dd className="text-sm text-slate-900 dark:text-slate-100">{user.role}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3">
                  {t('users.company')}
                </h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">{t('common.name')}:</dt>
                    <dd className="text-sm text-slate-900 dark:text-slate-100">{user.company?.name || t('common.noData')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">{t('machines.location')}:</dt>
                    <dd className="text-sm text-slate-900 dark:text-slate-100">
                      {user.locations?.length || 0} {t('navigation.locations')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Szybkie akcje */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              {t('dashboard.quickActions')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition-colors">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">{t('navigation.machines')}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('descriptions.machines')}</p>
              </button>
              <button className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition-colors">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">{t('navigation.workOrders')}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('descriptions.workOrders')}</p>
              </button>
              <button className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition-colors">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">{t('navigation.parts')}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('descriptions.parts')}</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 