'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SystemStatusCard } from '@/components/dashboard/SystemStatusCard';
import { FeatureCards } from '@/components/dashboard/FeatureCards';
import { SystemInfoCard } from '@/components/dashboard/SystemInfoCard';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        <SystemStatusCard />
        <FeatureCards />
        <SystemInfoCard />
      </div>
    </main>
  );
} 