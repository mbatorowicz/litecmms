import { Home, Settings, Users, BarChart2, Calendar, ClipboardList, AlertTriangle, Warehouse, FileText } from 'lucide-react';
import Link from 'next/link';

const menu = [
  { name: 'Dashboard', icon: <Home />, href: '/' },
  { name: 'Maszyny i Linie', icon: <BarChart2 />, href: '/machines' },
  { name: 'Harmonogram', icon: <Calendar />, href: '/schedule' },
  { name: 'Zlecenia', icon: <ClipboardList />, href: '/work-orders' },
  { name: 'Awarie', icon: <AlertTriangle />, href: '/alerts' },
  { name: 'Magazyn', icon: <Warehouse />, href: '/inventory' },
  { name: 'Raporty', icon: <FileText />, href: '/reports' },
  { name: 'Zespół', icon: <Users />, href: '/users' },
  { name: 'Ustawienia', icon: <Settings />, href: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-neutral-900 shadow-lg flex flex-col min-h-screen">
      <div className="h-16 flex items-center justify-center font-bold text-xl tracking-tight border-b dark:border-neutral-800">
        <span className="text-orange-600">CMMS Pro</span>
      </div>
      <nav className="flex-1 py-4">
        <ul className="flex flex-col gap-1">
          {menu.map((item, idx) => (
            <li key={idx}>
              <Link href={item.href as any} className="flex items-center gap-3 px-6 py-3 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-orange-100 dark:hover:bg-orange-900 transition font-medium">
                <span className="w-5 h-5">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 