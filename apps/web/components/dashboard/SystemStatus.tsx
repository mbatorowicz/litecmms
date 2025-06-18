'use client';

export default function SystemStatus() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-4 flex items-center gap-4">
      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
      <span className="font-medium">System sprawny</span>
      <span className="text-xs text-gray-400 ml-auto">Ostatnia aktualizacja: 18:08:48</span>
    </div>
  );
} 