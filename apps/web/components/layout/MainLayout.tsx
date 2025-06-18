"use client";
import { ReactNode, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex bg-neutral-100 dark:bg-neutral-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      
      <Toaster />
    </div>
  );
}

export default MainLayout; 