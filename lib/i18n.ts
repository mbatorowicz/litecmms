import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import tłumaczeń
import plTranslations from '../locales/pl/common.json';
import enTranslations from '../locales/en/common.json';
import deTranslations from '../locales/de/common.json';

const resources = {
  pl: {
    common: plTranslations,
  },
  en: {
    common: enTranslations,
  },
  de: {
    common: deTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pl', // Polski jako domyślny
    defaultNS: 'common',
    
    // Opcje detekcji języka
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React już escapuje
    },

    // Opcje deweloperskie
    debug: process.env.NODE_ENV === 'development',
    
    // Konfiguracja namespace'ów
    ns: ['common', 'dashboard', 'machines', 'workorders', 'parts', 'users', 'reports'],
    
    // Opcje ładowania
    load: 'languageOnly', // pl zamiast pl-PL
    
    // Opcje formatowania
    returnObjects: true,
    
    // Opcje pluralizacji
    pluralSeparator: '_',
    contextSeparator: '_',
  });

export default i18n;

// Hook do zmiany języka
export const useLanguage = () => {
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = () => i18n.language;
  
  const getSupportedLanguages = () => ['pl', 'en', 'de'];

  return {
    changeLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    currentLanguage: i18n.language,
  };
}; 