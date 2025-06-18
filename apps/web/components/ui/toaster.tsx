"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    showToast: (msg: string) => void;
  }
}

export interface ToasterProps {
  duration?: number;
  children?: React.ReactNode;
}

export function Toaster({ duration = 4000, children }: ToasterProps) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  // Pozwala wywołać toast globalnie
  React.useEffect(() => {
    window.showToast = (msg: string) => {
      setMessage(msg);
      setOpen(true);
    };
  }, []);

  return (
    <ToastPrimitives.Provider swipeDirection="right" duration={duration}>
      <ToastPrimitives.Root
        open={open}
        onOpenChange={setOpen}
        className={cn(
          "fixed bottom-4 right-4 z-50 w-[320px] rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4"
        )}
      >
        <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">
          {message || children}
        </span>
        <button
          onClick={() => setOpen(false)}
          className="ml-auto text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label="Zamknij"
        >
          ×
        </button>
      </ToastPrimitives.Root>
      <ToastPrimitives.Viewport />
    </ToastPrimitives.Provider>
  );
}

// Użycie: window.showToast('Twoja wiadomość!') 