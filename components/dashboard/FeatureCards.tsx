import { useTranslation } from 'react-i18next';

interface FeatureCard {
  titleKey: string;
  descriptionKey: string;
}

const features: FeatureCard[] = [
  { titleKey: 'machines.title', descriptionKey: 'descriptions.machines' },
  { titleKey: 'workOrders.title', descriptionKey: 'descriptions.workOrders' },
  { titleKey: 'parts.title', descriptionKey: 'descriptions.parts' },
  { titleKey: 'users.title', descriptionKey: 'descriptions.users' },
  { titleKey: 'reports.title', descriptionKey: 'descriptions.reports' },
  { titleKey: 'settings.title', descriptionKey: 'descriptions.settings' },
];

export function FeatureCards() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {t(feature.titleKey)}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            {t(feature.descriptionKey)}
          </p>
        </div>
      ))}
    </div>
  );
} 