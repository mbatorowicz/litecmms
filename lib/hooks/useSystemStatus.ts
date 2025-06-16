import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Status } from '@/components/ui/StatusIndicator';

interface SystemStatus {
  apiStatus: Status;
  apiMessage: string;
  dbStatus: Status;
  dbMessage: string;
}

export function useSystemStatus(): SystemStatus {
  const { i18n } = useTranslation();
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

  return {
    apiStatus,
    apiMessage,
    dbStatus,
    dbMessage
  };
} 