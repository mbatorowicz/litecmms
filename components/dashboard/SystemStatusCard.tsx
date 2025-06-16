import { useTranslation } from 'react-i18next';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { useSystemStatus } from '@/lib/hooks/useSystemStatus';

export function SystemStatusCard() {
  const { t } = useTranslation();
  const { apiStatus, apiMessage, dbStatus, dbMessage } = useSystemStatus();

  return (
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
  );
} 