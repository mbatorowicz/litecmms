'use client';

import { 
  LucideActivity,
  LucideClipboardList,
  LucideCalendarCheck,
  LucideDollarSign
} from 'lucide-react';

const cards = [
  {
    title: 'Dostępność maszyn',
    value: '94.2%',
    change: '+2.1%',
    icon: <LucideActivity className="w-8 h-8 text-green-500" />,
    description: 'vs wczoraj',
    color: 'bg-green-50',
  },
  {
    title: 'Otwarte zlecenia',
    value: '23',
    change: '-5',
    icon: <LucideClipboardList className="w-8 h-8 text-yellow-500" />,
    description: 'vs wczoraj',
    color: 'bg-yellow-50',
  },
  {
    title: 'Przeglądy dziś',
    value: '8',
    change: '+2',
    icon: <LucideCalendarCheck className="w-8 h-8 text-blue-500" />,
    description: 'vs plan',
    color: 'bg-blue-50',
  },
  {
    title: 'Koszt miesiąca',
    value: '47.2k zł',
    change: '+12%',
    icon: <LucideDollarSign className="w-8 h-8 text-purple-500" />,
    description: 'vs poprzedni',
    color: 'bg-purple-50',
  },
];

export function FeatureCards() {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`rounded-xl shadow-md p-6 flex flex-col gap-2 ${card.color}`}> 
          <div className="flex items-center gap-4">
            {card.icon}
            <div>
              <div className="text-lg font-semibold">{card.title}</div>
              <div className="text-2xl font-bold">{card.value}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <span className="font-medium">{card.change}</span>
            <span className="text-gray-500">{card.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeatureCards; 