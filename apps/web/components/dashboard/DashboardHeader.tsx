'use client';

import { useTranslation } from 'react-i18next';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

interface DashboardHeaderProps {
  onLogout: () => void;
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

export function DashboardHeader({ onLogout, user }: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo i nazwa systemu */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image
                className="h-8 w-auto"
                src="/logo.png"
                alt="LiteCMMS"
                width={32}
                height={32}
                priority
              />
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                LiteCMMS v2.0
              </h1>
            </div>
          </div>

          {/* Prawa strona - użytkownik i akcje */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
              <User className="w-4 h-4" />
              <span>{user.firstName} {user.lastName}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{user.role}</span>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 