'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Inicjalizacja i18n po stronie klienta
    if (typeof window !== 'undefined') {
      // Sprawdź czy język jest już ustawiony w localStorage
      const savedLanguage = localStorage.getItem('i18nextLng');
      if (savedLanguage && ['pl', 'en', 'de'].includes(savedLanguage)) {
        i18n.changeLanguage(savedLanguage);
      }
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 