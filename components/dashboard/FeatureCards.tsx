'use client';

import { useTranslation } from 'react-i18next';
import { 
  Wrench, 
  ClipboardList, 
  Package, 
  Users, 
  BarChart2,
  Settings
} from 'lucide-react';
import Link from 'next/link';

interface FeatureCard {
  title: string;
  description: string;
  icon: any;
  color: string;
  href: string;
}

export function FeatureCards() {
  const { t } = useTranslation();

  const features: FeatureCard[] = [
    {
      title: t('machines.title'),
      description: t('machines.description'),
      icon: Wrench,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      href: '/machines'
    },
    {
      title: t('workOrders.title'),
      description: t('workOrders.description'),
      icon: ClipboardList,
      color: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      href: '/workorders'
    },
    {
      title: t('parts.title'),
      description: t('parts.description'),
      icon: Package,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
      href: '/parts'
    },
    {
      title: t('users.title'),
      description: t('users.description'),
      icon: Users,
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
      href: '/users'
    },
    {
      title: t('reports.title'),
      description: t('reports.description'),
      icon: BarChart2,
      color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
      href: '/reports'
    },
    {
      title: t('settings.title'),
      description: t('settings.description'),
      icon: Settings,
      color: 'text-gray-500 bg-gray-50 dark:bg-gray-900/20',
      href: '/settings'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
        {t('dashboard.features')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="group block p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {feature.title}
                </h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 