'use client';

// import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  // const { i18n } = useTranslation();

  const languages = [
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex items-center px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => {
          const currentIndex = languages.findIndex(lang => lang.code === i18n.language);
          const nextIndex = (currentIndex + 1) % languages.length;
          i18n.changeLanguage(languages[nextIndex].code);
        }}
      >
        <Globe className="w-4 h-4 mr-2" />
        {languages.find(lang => lang.code === i18n.language)?.flag}
      </button>
    </div>
  );
} 