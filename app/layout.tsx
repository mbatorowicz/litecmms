import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/components/providers/I18nProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LiteCMMS v2.0 - Advanced Maintenance Management System',
  description: 'Nowoczesny system zarządzania konserwacją dla średnich przedsiębiorstw',
  keywords: 'CMMS, maintenance, zarządzanie konserwacją, maszyny, zlecenia pracy',
  authors: [{ name: 'LiteCMMS Team' }],
  creator: 'LiteCMMS',
  publisher: 'LiteCMMS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <I18nProvider>
          <div id="root">
            {children}
          </div>
        </I18nProvider>
      </body>
    </html>
  );
} 