import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import QueryProvider from './providers';

export const metadata: Metadata = {
  title: 'LiteCMMS v2.0',
  description: 'System Zarządzania Utrzymaniem Ruchu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
