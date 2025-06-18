import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ open, onOpenChange, title, children }: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl">
          {title && <DialogPrimitive.Title className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{title}</DialogPrimitive.Title>}
          {children}
          <DialogPrimitive.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">×</DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
} 