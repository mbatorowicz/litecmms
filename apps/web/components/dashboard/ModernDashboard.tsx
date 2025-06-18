'use client';

import { 
  Activity, 
  ClipboardList, 
  Calendar, 
  DollarSign,
  Home,
  BarChart2,
  Settings,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuthContext } from '@/lib/providers/AuthProvider';

// Mock data
const kpiData = [
  {
    title: 'Dostępność maszyn',
    value: '94.2%',
    change: '+2.1%',
    changeType: 'positive',
    icon: Activity
  },
  {
    title: 'Otwarte zlecenia',
    value: '23',
    change: '-5',
    changeType: 'positive',
    icon: ClipboardList
  },
  {
    title: 'Przeglądy dziś',
    value: '8',
    change: '+2',
    changeType: 'positive',
    icon: Calendar
  },
  {
    title: 'Koszt miesiąca',
    value: '47.2k zł',
    change: '+12%',
    changeType: 'negative',
    icon: DollarSign
  }
];

const urgentTasksData = [
  {
    id: 1,
    title: 'Linia A-102',
    description: 'Przegląd miesięczny',
    duration: '2 godz.',
    assignedTo: 'Jan Kowalski',
    priority: 'critical',
    dueDate: '2024-01-16'
  },
  {
    id: 2,
    title: 'Prasa P-05',
    description: 'Wymiana filtra',
    duration: '4 godz.',
    assignedTo: 'Anna Nowak',
    priority: 'high',
    dueDate: '2024-01-16'
  },
  {
    id: 3,
    title: 'Konwejer K-201',
    description: 'Smarowanie łożysk',
    duration: '6 godz.',
    assignedTo: 'Piotr Zieliński',
    priority: 'high',
    dueDate: '2024-01-17'
  }
];

const recentActivities = [
  {
    id: 1,
    action: 'Zlecenie ukończone',
    target: 'Linia B-205',
    user: 'Technik #1',
    time: '5 min temu',
    type: 'success'
  },
  {
    id: 2,
    action: 'Nowe zgłoszenie',
    target: 'Sprężarka S-301',
    user: 'Operator #3',
    time: '15 min temu',
    type: 'warning'
  },
  {
    id: 3,
    action: 'Przegląd zaplanowany',
    target: 'Tokarka T-101',
    user: 'System',
    time: '1 godz. temu',
    type: 'info'
  }
];

const sidebarLinks = [
  { name: 'Dashboard', icon: Home, href: '/', active: true },
  { name: 'Maszyny i Linie', icon: BarChart2, href: '/machines' },
  { name: 'Harmonogram', icon: Calendar, href: '/schedule' },
  { name: 'Zlecenia', icon: ClipboardList, href: '/orders' },
  { name: 'Użytkownicy', icon: Users, href: '/users' },
  { name: 'Ustawienia', icon: Settings, href: '/settings' }
];

function KPICard({ title, value, change, changeType, icon: Icon }: any) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div style={{ backgroundColor: 'var(--primary-50)', padding: '12px', borderRadius: '8px' }}>
          <Icon size={24} style={{ color: 'var(--primary-500)' }} />
        </div>
      </div>
      <div style={{ marginTop: '16px' }} className="flex items-center">
        <span style={{ color: changeType === 'positive' ? 'var(--success-500)' : 'var(--danger-500)' }}>
          {change}
        </span>
        <span style={{ marginLeft: '8px' }} className="text-sm text-gray-500">vs wczoraj</span>
      </div>
    </div>
  );
}

function TaskCard({ task }: any) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'var(--danger-500)';
      case 'high': return 'var(--warning-500)';
      default: return 'var(--primary-500)';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Krytyczny';
      case 'high': return 'Wysoki';
      default: return 'Średni';
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {task.duration}
            </span>
            <span>{task.assignedTo}</span>
          </div>
        </div>
        <div className="ml-4">
          <span 
            className="badge"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {getPriorityLabel(task.priority)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ activity }: any) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="status-online" />;
      case 'warning': return <AlertTriangle size={16} className="status-warning" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
      {getActivityIcon(activity.type)}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
        <p className="text-sm text-gray-500">{activity.target}</p>
        <p className="text-xs text-gray-400 mt-1">{activity.user} • {activity.time}</p>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--gray-900)' }}>
          LiteCMMS Pro
        </h1>
      </div>
      
      <nav style={{ flex: 1, padding: '0 16px' }}>
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              className={`sidebar-link ${link.active ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function Header() {
  const { user, logout } = useAuthContext();
  
  const handleLogout = async () => {
    try {
      // Wywołaj logout z backend
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    } finally {
      // Zawsze wyczyść lokalnie
      logout();
    }
  };

  return (
    <header style={{ 
      backgroundColor: 'white', 
      borderBottom: '1px solid var(--gray-200)', 
      padding: '16px 24px' 
    }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--gray-900)' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>
            Dzień dobry, {user?.firstName || 'Admin'} 👋
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--gray-500)' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: 'var(--success-500)', 
              borderRadius: '50%' 
            }}></div>
            <span>System sprawny</span>
          </div>
          
          {user && (
            <div style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
              {user.firstName} {user.lastName} 
              <span style={{ color: 'var(--gray-400)', marginLeft: '8px' }}>
                ({user.role})
              </span>
            </div>
          )}
          
          <button className="btn btn-orange" onClick={handleLogout}>
            Wyloguj
          </button>
          
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: 'var(--orange-100)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--orange-700)' }}>
              {user?.firstName?.[0] || 'A'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function ModernDashboard() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <Sidebar />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '32px' }}>
            {kpiData.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Urgent Tasks */}
            <div style={{ gridColumn: 'span 2 / span 2' }}>
              <div className="card">
                <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gray-900)' }}>
                    Pilne Zadania
                  </h2>
                  <span style={{ fontSize: '14px', color: 'var(--gray-500)' }}>3 zadania</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="card">
                    <div className="flex justify-between items-start">
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: '600', color: 'var(--gray-900)' }}>Linia A-102</h3>
                        <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '4px' }}>
                          Przegląd miesięczny
                        </p>
                        <div className="flex items-center gap-4" style={{ 
                          marginTop: '12px', 
                          fontSize: '14px', 
                          color: 'var(--gray-500)' 
                        }}>
                          <span className="flex items-center gap-1">
                            <Clock size={16} />
                            2 godz.
                          </span>
                          <span>Jan Kowalski</span>
                        </div>
                      </div>
                      <span className="badge badge-critical">Krytyczny</span>
                    </div>
                  </div>
                  
                  <div className="card">
                    <div className="flex justify-between items-start">
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: '600', color: 'var(--gray-900)' }}>Prasa P-05</h3>
                        <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '4px' }}>
                          Wymiana filtra
                        </p>
                        <div className="flex items-center gap-4" style={{ 
                          marginTop: '12px', 
                          fontSize: '14px', 
                          color: 'var(--gray-500)' 
                        }}>
                          <span className="flex items-center gap-1">
                            <Clock size={16} />
                            4 godz.
                          </span>
                          <span>Anna Nowak</span>
                        </div>
                      </div>
                      <span className="badge badge-warning">Wysoki</span>
                    </div>
                  </div>
                  
                  <div className="card">
                    <div className="flex justify-between items-start">
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: '600', color: 'var(--gray-900)' }}>Konwejer K-201</h3>
                        <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '4px' }}>
                          Smarowanie łożysk
                        </p>
                        <div className="flex items-center gap-4" style={{ 
                          marginTop: '12px', 
                          fontSize: '14px', 
                          color: 'var(--gray-500)' 
                        }}>
                          <span className="flex items-center gap-1">
                            <Clock size={16} />
                            6 godz.
                          </span>
                          <span>Piotr Zieliński</span>
                        </div>
                      </div>
                      <span className="badge badge-warning">Wysoki</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar Content */}
            <div>
              {/* Recent Activity */}
              <div className="card" style={{ marginBottom: '24px' }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--gray-900)', 
                  marginBottom: '24px' 
                }}>
                  Ostatnia Aktywność
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="flex items-start gap-3 p-3 rounded-lg transition" style={{ 
                    backgroundColor: 'transparent' 
                  }}>
                    <CheckCircle size={16} className="status-online" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--gray-900)' }}>
                        Zlecenie ukończone
                      </p>
                      <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>Linia B-205</p>
                      <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>
                        Technik #1 • 5 min temu
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg transition">
                    <AlertTriangle size={16} className="status-warning" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--gray-900)' }}>
                        Nowe zgłoszenie
                      </p>
                      <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>Sprężarka S-301</p>
                      <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>
                        Operator #3 • 15 min temu
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg transition">
                    <Clock size={16} style={{ color: 'var(--gray-400)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--gray-900)' }}>
                        Przegląd zaplanowany
                      </p>
                      <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>Tokarka T-101</p>
                      <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>
                        System • 1 godz. temu
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* System Status */}
              <div className="card">
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--gray-900)', 
                  marginBottom: '16px' 
                }}>
                  Status Systemu
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>Serwer API:</span>
                    <div className="flex items-center gap-2">
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: 'var(--success-500)', 
                        borderRadius: '50%' 
                      }}></div>
                      <span className="status-online" style={{ fontSize: '14px', fontWeight: '500' }}>
                        Online
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>Baza Danych:</span>
                    <div className="flex items-center gap-2">
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: 'var(--success-500)', 
                        borderRadius: '50%' 
                      }}></div>
                      <span className="status-online" style={{ fontSize: '14px', fontWeight: '500' }}>
                        Połączona
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                      Ostatnia aktualizacja:
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--gray-500)' }}>18:08:48</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 