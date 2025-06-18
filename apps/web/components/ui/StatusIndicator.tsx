import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

// Typy statusów
type Status = 'success' | 'error' | 'warning' | 'loading';

interface StatusIndicatorProps {
  status: Status;
  message: string;
}

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'loading':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'loading':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {message}
      </span>
    </div>
  );
}

export type { Status }; 