import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Machine, MaintenanceTask, Alert } from '@/types/api';

interface AppState {
  // UI State
  isDarkMode: boolean;
  language: 'pl' | 'en' | 'de';
  sidebarOpen: boolean;
  
  // Data State
  machines: Machine[];
  maintenanceTasks: MaintenanceTask[];
  alerts: Alert[];
  
  // Loading States
  isLoading: boolean;
  error: string | null;
  
  // Actions
  toggleDarkMode: () => void;
  setLanguage: (lang: 'pl' | 'en' | 'de') => void;
  toggleSidebar: () => void;
  
  setMachines: (machines: Machine[]) => void;
  setMaintenanceTasks: (tasks: MaintenanceTask[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      isDarkMode: false,
      language: 'pl',
      sidebarOpen: true,
      
      machines: [],
      maintenanceTasks: [],
      alerts: [],
      
      isLoading: false,
      error: null,
      
      // Actions
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setLanguage: (lang) => set({ language: lang }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setMachines: (machines) => set({ machines }),
      setMaintenanceTasks: (tasks) => set({ maintenanceTasks: tasks }),
      setAlerts: (alerts) => set({ alerts }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        language: state.language,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
); 