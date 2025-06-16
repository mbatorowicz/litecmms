import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { AuthProvider } from '@/lib/hooks/useAuth';

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
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon-192x192.svg',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LiteCMMS',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
  colorScheme: 'light',
  userScalable: false,
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
          <AuthProvider>
            <div id="root">
              {children}
            </div>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
} 