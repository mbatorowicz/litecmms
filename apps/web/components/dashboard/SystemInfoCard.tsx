'use client';

// import { useTranslation } from 'react-i18next';
import { 
  Wrench, 
  ClipboardList, 
  Package, 
  Users, 
  BarChart2,
  Code2,
  Database,
  Globe
} from 'lucide-react';

export function SystemInfoCard() {
  // const { t } = useTranslation();

  const features = [
    { icon: Wrench, text: t('machines.title') },
    { icon: ClipboardList, text: t('workOrders.title') },
    { icon: Package, text: t('parts.title') },
    { icon: Users, text: t('users.title') },
    { icon: BarChart2, text: t('reports.title') }
  ];

  const technologies = [
    { icon: Code2, text: 'Next.js 15' },
    { icon: Code2, text: 'TypeScript' },
    { icon: Code2, text: 'Fastify' },
    { icon: Database, text: 'PostgreSQL' },
    { icon: Database, text: 'Prisma ORM' }
  ];

  const languages = [
    { flag: '🇵🇱', text: t('languages.pl') },
    { flag: '🇺🇸', text: t('languages.en') },
    { flag: '🇩🇪', text: t('languages.de') }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
        <Globe className="w-5 h-5" />
        {t('systemInfo.title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            {t('common.features')}
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <feature.icon className="w-4 h-4 text-blue-500" />
                {feature.text}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            {t('common.technologies')}
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-3">
            {technologies.map((tech, index) => (
              <li key={index} className="flex items-center gap-2">
                <tech.icon className="w-4 h-4 text-green-500" />
                {tech.text}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t('systemInfo.languages')}
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-3">
            {languages.map((lang, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                {lang.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 