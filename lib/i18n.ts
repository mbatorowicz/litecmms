import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import modułów tłumaczeń - Polski
import plBase from '../locales/pl/modules/base.json';
import plAuth from '../locales/pl/modules/auth.json';
import plDashboard from '../locales/pl/modules/dashboard.json';
import plMachines from '../locales/pl/modules/machines.json';
import plWorkorders from '../locales/pl/modules/workorders.json';
import plParts from '../locales/pl/modules/parts.json';
import plUsers from '../locales/pl/modules/users.json';
import plReports from '../locales/pl/modules/reports.json';

// Import modułów tłumaczeń - Angielski
import enBase from '../locales/en/modules/base.json';
import enAuth from '../locales/en/modules/auth.json';
import enDashboard from '../locales/en/modules/dashboard.json';
import enMachines from '../locales/en/modules/machines.json';
import enWorkorders from '../locales/en/modules/workorders.json';
import enParts from '../locales/en/modules/parts.json';
import enUsers from '../locales/en/modules/users.json';
import enReports from '../locales/en/modules/reports.json';

// Import modułów tłumaczeń - Niemiecki
import deBase from '../locales/de/modules/base.json';
import deAuth from '../locales/de/modules/auth.json';
import deDashboard from '../locales/de/modules/dashboard.json';
import deMachines from '../locales/de/modules/machines.json';
import deWorkorders from '../locales/de/modules/workorders.json';
import deParts from '../locales/de/modules/parts.json';
import deUsers from '../locales/de/modules/users.json';
import deReports from '../locales/de/modules/reports.json';

// Scalanie modułów dla wszystkich języków
const plTranslations = {
  ...plBase,
  ...plAuth,
  ...plDashboard,
  ...plMachines,
  ...plWorkorders,
  ...plParts,
  ...plUsers,
  ...plReports,
};

const enTranslations = {
  ...enBase,
  ...enAuth,
  ...enDashboard,
  ...enMachines,
  ...enWorkorders,
  ...enParts,
  ...enUsers,
  ...enReports,
};

const deTranslations = {
  ...deBase,
  ...deAuth,
  ...deDashboard,
  ...deMachines,
  ...deWorkorders,
  ...deParts,
  ...deUsers,
  ...deReports,
};

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