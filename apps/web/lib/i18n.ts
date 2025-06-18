import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pl: {
    translation: {
      auth: {
        logout: 'Wyloguj się',
        login: 'Zaloguj się',
        register: 'Zarejestruj się'
      },
      machines: {
        title: 'Maszyny',
        status: 'Status',
        maintenance: 'Konserwacja'
      },
      workOrders: {
        title: 'Zlecenia pracy',
        new: 'Nowe zlecenie',
        status: 'Status'
      },
      parts: {
        title: 'Części zamienne',
        stock: 'Stan magazynowy'
      },
      users: {
        title: 'Użytkownicy',
        profile: 'Profil'
      },
      reports: {
        title: 'Raporty',
        generate: 'Generuj raport'
      },
      languages: {
        pl: 'Polski',
        en: 'English',
        de: 'Deutsch'
      },
      common: {
        features: 'Funkcje',
        technologies: 'Technologie',
        save: 'Zapisz',
        cancel: 'Anuluj',
        delete: 'Usuń',
        edit: 'Edytuj'
      },
      systemInfo: {
        title: 'Informacje o systemie',
        languages: 'Języki',
        version: 'Wersja'
      },
      settings: {
        language: 'Język',
        theme: 'Motyw',
        notifications: 'Powiadomienia'
      }
    }
  },
  en: {
    translation: {
      auth: {
        logout: 'Logout',
        login: 'Login',
        register: 'Register'
      },
      machines: {
        title: 'Machines',
        status: 'Status',
        maintenance: 'Maintenance'
      },
      workOrders: {
        title: 'Work Orders',
        new: 'New Work Order',
        status: 'Status'
      },
      parts: {
        title: 'Parts',
        stock: 'Stock Level'
      },
      users: {
        title: 'Users',
        profile: 'Profile'
      },
      reports: {
        title: 'Reports',
        generate: 'Generate Report'
      },
      languages: {
        pl: 'Polski',
        en: 'English',
        de: 'Deutsch'
      },
      common: {
        features: 'Features',
        technologies: 'Technologies',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit'
      },
      systemInfo: {
        title: 'System Information',
        languages: 'Languages',
        version: 'Version'
      },
      settings: {
        language: 'Language',
        theme: 'Theme',
        notifications: 'Notifications'
      }
    }
  },
  de: {
    translation: {
      auth: {
        logout: 'Abmelden',
        login: 'Anmelden',
        register: 'Registrieren'
      },
      machines: {
        title: 'Maschinen',
        status: 'Status',
        maintenance: 'Wartung'
      },
      workOrders: {
        title: 'Arbeitsaufträge',
        new: 'Neuer Auftrag',
        status: 'Status'
      },
      parts: {
        title: 'Ersatzteile',
        stock: 'Lagerbestand'
      },
      users: {
        title: 'Benutzer',
        profile: 'Profil'
      },
      reports: {
        title: 'Berichte',
        generate: 'Bericht erstellen'
      },
      languages: {
        pl: 'Polski',
        en: 'English',
        de: 'Deutsch'
      },
      common: {
        features: 'Funktionen',
        technologies: 'Technologien',
        save: 'Speichern',
        cancel: 'Abbrechen',
        delete: 'Löschen',
        edit: 'Bearbeiten'
      },
      systemInfo: {
        title: 'Systeminformationen',
        languages: 'Sprachen',
        version: 'Version'
      },
      settings: {
        language: 'Sprache',
        theme: 'Thema',
        notifications: 'Benachrichtigungen'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pl',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n; 