'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

// Komponenty UI
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

// Typy statusów
type Status = 'success' | 'error' | 'warning' | 'loading';

interface StatusIndicatorProps {
  status: Status;
  message: string;
}

function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'loading':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'loading':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {message}
      </span>
    </div>
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [apiStatus, setApiStatus] = useState<Status>('loading');
  const [apiMessage, setApiMessage] = useState('');
  const [dbStatus, setDbStatus] = useState<Status>('loading');
  const [dbMessage, setDbMessage] = useState('');

  // Funkcja tłumaczenia komunikatów statusu
  const getStatusMessage = (key: string) => {
    const messages: Record<string, Record<string, string>> = {
      checking: {
        pl: 'Sprawdzanie...',
        en: 'Checking...',
        de: 'Überprüfung...'
      },
      connectionActive: {
        pl: 'Połączenie aktywne',
        en: 'Connection active',
        de: 'Verbindung aktiv'
      },
      databaseUnavailable: {
        pl: 'Baza danych niedostępna',
        en: 'Database unavailable',
        de: 'Datenbank nicht verfügbar'
      },
      connectionError: {
        pl: 'Błąd połączenia',
        en: 'Connection error',
        de: 'Verbindungsfehler'
      },
      unavailable: {
        pl: 'Niedostępna',
        en: 'Unavailable',
        de: 'Nicht verfügbar'
      },
      networkError: {
        pl: 'Błąd sieci',
        en: 'Network error',
        de: 'Netzwerkfehler'
      }
    };
    
    const currentLang = i18n.language || 'pl';
    return messages[key]?.[currentLang] || messages[key]?.['pl'] || key;
  };

  // Sprawdzanie statusu systemu
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await fetch('/api/system-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setApiStatus('success');
          setApiMessage(getStatusMessage('connectionActive'));
          
          const data = await response.json();
          
          if (data.database?.status === 'success') {
            setDbStatus('success');
            setDbMessage(getStatusMessage('connectionActive'));
          } else {
            setDbStatus('warning');
            setDbMessage(getStatusMessage('databaseUnavailable'));
          }
        } else {
          setApiStatus('error');
          setApiMessage(getStatusMessage('connectionError'));
          setDbStatus('error');
          setDbMessage(getStatusMessage('unavailable'));
        }
      } catch (error) {
        setApiStatus('error');
        setApiMessage(getStatusMessage('networkError'));
        setDbStatus('error');
        setDbMessage(getStatusMessage('unavailable'));
      }
    };

    // Ustawienie komunikatu sprawdzania przy załadowaniu
    setApiMessage(getStatusMessage('checking'));
    setDbMessage(getStatusMessage('checking'));

    checkSystemStatus();
    
    // Sprawdzaj status co 30 sekund
    const interval = setInterval(checkSystemStatus, 30000);
    
    return () => clearInterval(interval);
  }, [i18n.language]); // Zależność od języka

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Nagłówek z przełącznikiem języka */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {t('app.name')}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {t('app.description')}
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Karta statusu systemu */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            {t('dashboard.systemStatus')}
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t('common.apiServer')}:
              </span>
              <StatusIndicator status={apiStatus} message={apiMessage} />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t('common.database')}:
              </span>
              <StatusIndicator status={dbStatus} message={dbMessage} />
            </div>
          </div>
        </div>

        {/* Główne funkcjonalności */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Maszyny */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {t('machines.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {t('descriptions.machines')}
            </p>
          </div>

          {/* Zlecenia pracy */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {t('workOrders.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {t('descriptions.workOrders')}
            </p>
          </div>

          {/* Części zamienne */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {t('parts.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {t('descriptions.parts')}
            </p>
          </div>

          {/* Użytkownicy */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {t('users.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {t('descriptions.users')}
            </p>
          </div>

          {/* Raporty */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {t('reports.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {t('descriptions.reports')}
            </p>
          </div>

          {/* Ustawienia */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {t('settings.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {t('descriptions.settings')}
            </p>
          </div>
        </div>

        {/* Informacje o systemie */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            {t('systemInfo.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-2">
                {t('common.features')}
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• {t('machines.title')}</li>
                <li>• {t('workOrders.title')}</li>
                <li>• {t('parts.title')}</li>
                <li>• {t('users.title')}</li>
                <li>• {t('reports.title')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-2">
                {t('common.technologies')}
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• Next.js 15</li>
                <li>• TypeScript</li>
                <li>• Fastify</li>
                <li>• PostgreSQL</li>
                <li>• Prisma ORM</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-2">
                {t('systemInfo.languages')}
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• 🇵🇱 {t('languages.pl')}</li>
                <li>• 🇺🇸 {t('languages.en')}</li>
                <li>• 🇩🇪 {t('languages.de')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 