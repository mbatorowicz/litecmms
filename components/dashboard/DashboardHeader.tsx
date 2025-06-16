import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function DashboardHeader() {
  const { t } = useTranslation();

  return (
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
  );
} 