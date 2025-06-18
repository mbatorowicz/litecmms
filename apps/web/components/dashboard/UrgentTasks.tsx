'use client';

const urgentTasks = [
  {
    title: 'Linia A-102',
    description: 'Przegląd miesięczny',
    duration: '2 godz.',
    assignedTo: 'Jan Kowalski',
    priority: 'critical',
  },
  {
    title: 'Prasa P-05',
    description: 'Wymiana filtra',
    duration: '4 godz.',
    assignedTo: 'Anna Nowak',
    priority: 'high',
  },
  {
    title: 'Konwejer K-201',
    description: 'Smarowanie łożysk',
    duration: '6 godz.',
    assignedTo: 'Piotr Zieliński',
    priority: 'high',
  },
];

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'critical': return 'Krytyczny';
    case 'high': return 'Wysoki';
    case 'medium': return 'Średni';
    case 'low': return 'Niski';
    default: return priority;
  }
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-yellow-400 text-black';
    case 'medium': return 'bg-blue-400 text-white';
    case 'low': return 'bg-green-400 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

export default function UrgentTasks() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6">
      <div className="text-xl font-bold mb-4">Pilne Zadania</div>
      <div className="flex flex-col gap-4">
        {urgentTasks.map((task, index) => (
          <div 
            key={index} 
            className="p-4 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-neutral-50 dark:bg-neutral-800"
          >
            <div>
              <div className="font-semibold">{task.title}</div>
              <div className="text-gray-500 text-sm">{task.description}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">{task.duration}</span>
              <span className="text-xs text-gray-400">{task.assignedTo}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityStyle(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 