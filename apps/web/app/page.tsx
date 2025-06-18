'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import ModernDashboard from '@/components/dashboard/ModernDashboard';

export default function HomePage() {
  return (
    <AuthGuard>
      <ModernDashboard />
    </AuthGuard>
  );
} 