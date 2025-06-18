'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-neutral-900 border-b dark:border-neutral-800 shadow-sm">
      <div className="text-lg font-semibold">Dzień dobry, Admin 👋</div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-orange-600 text-white font-medium hover:bg-orange-700 transition"
        >
          Wyloguj
        </button>
        <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-800">
          A
        </div>
      </div>
    </header>
  );
} 