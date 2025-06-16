import { useTranslation } from 'react-i18next';

export function SystemInfoCard() {
  const { t } = useTranslation();

  return (
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
  );
} 