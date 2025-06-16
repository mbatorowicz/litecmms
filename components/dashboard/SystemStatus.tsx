'use client';

import { useState, useEffect } from 'react';

interface SystemStatusProps {
  className?: string;
}

export default function SystemStatus({ className }: SystemStatusProps) {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [dbStatus, setDbStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiMessage, setApiMessage] = useState('Sprawdzanie...');
  const [dbMessage, setDbMessage] = useState('Sprawdzanie...');

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/system-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Sprawdź status API serwera
          if (data.apiServer?.status === 'ok') {
            setApiStatus('success');
            setApiMessage('Połączenie aktywne');
          } else {
            setApiStatus('error');
            setApiMessage('Błąd połączenia');
          }
          
          // Sprawdź status bazy danych
          if (data.database?.status === 'ok') {
            setDbStatus('success');
            setDbMessage('Połączenie aktywne');
          } else {
            setDbStatus('error');
            setDbMessage('Baza danych niedostępna');
          }
        } else {
          setApiStatus('error');
          setApiMessage('Błąd połączenia');
          setDbStatus('error');
          setDbMessage('Niedostępna');
        }
      } catch (error) {
        setApiStatus('error');
        setApiMessage('Błąd sieci');
        setDbStatus('error');
        setDbMessage('Niedostępna');
      }
    };

    checkSystemStatus();
    
    // Sprawdzaj status co 30 sekund
    const interval = setInterval(checkSystemStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
          Serwer API:
        </span>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apiStatus)}`}>
            {getStatusIcon(apiStatus)} {apiMessage}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
          Baza danych:
        </span>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dbStatus)}`}>
            {getStatusIcon(dbStatus)} {dbMessage}
          </span>
        </div>
      </div>
    </div>
  );
} 