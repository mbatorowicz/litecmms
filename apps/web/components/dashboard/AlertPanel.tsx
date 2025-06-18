const alerty = [
  {
    tytul: 'Linia B-205',
    opis: 'Wysokie wibracje wykryte',
    czas: '15 min temu',
    status: 'Krytyczny',
  },
  {
    tytul: 'Pompa P-12',
    opis: 'Temperatura oleju powyżej normy',
    czas: '45 min temu',
    status: 'Ostrzeżenie',
  },
  {
    tytul: 'Wentylator W-08',
    opis: 'Spadek wydajności o 15%',
    czas: '2 godz. temu',
    status: 'Informacja',
  },
];

export default function AlertPanel() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6">
      <div className="text-xl font-bold mb-4">Alerty</div>
      <div className="flex flex-col gap-4">
        {alerty.map((a, idx) => (
          <div key={idx} className="p-4 rounded-lg border flex flex-col gap-1 bg-neutral-50 dark:bg-neutral-800">
            <div className="font-semibold">{a.tytul}</div>
            <div className="text-gray-500 text-sm">{a.opis}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{a.czas}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${a.status === 'Krytyczny' ? 'bg-red-500 text-white' : a.status === 'Ostrzeżenie' ? 'bg-yellow-400 text-black' : 'bg-blue-200 text-blue-900'}`}>{a.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 