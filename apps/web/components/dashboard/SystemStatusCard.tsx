import { StatusIndicator } from '@/components/ui/StatusIndicator';

export function SystemStatusCard() {
  // Tymczasowo hardcoded - dodamy hooki później
  const apiStatus = 'online';
  const apiMessage = 'API działa poprawnie';
  const dbStatus = 'online';
  const dbMessage = 'Baza danych połączona';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Status Systemu
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Serwer API:
          </span>
          <StatusIndicator status={apiStatus} message={apiMessage} />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Baza Danych:
          </span>
          <StatusIndicator status={dbStatus} message={dbMessage} />
        </div>
      </div>
    </div>
  );
} 