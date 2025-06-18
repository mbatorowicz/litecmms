import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
  const Icon = icons[variant];
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border-l-4 p-4',
        {
          'border-primary-500 bg-primary-50 text-primary-800': variant === 'info',
          'border-success-500 bg-success-50 text-success-800': variant === 'success',
          'border-warning-500 bg-warning-50 text-warning-800': variant === 'warning',
          'border-error-500 bg-error-50 text-error-800': variant === 'error',
        },
        className
      )}
      {...props}
    >
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div>
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
} 