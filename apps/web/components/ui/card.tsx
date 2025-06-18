import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ className, header, footer, children, ...props }: CardProps) {
  return (
    <div className={cn('rounded-lg border bg-white dark:bg-gray-900 shadow-sm', className)} {...props}>
      {header && <div className="border-b px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="border-t px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{footer}</div>}
    </div>
  );
} 