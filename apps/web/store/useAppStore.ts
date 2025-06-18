import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Machine, MaintenanceTask, Alert } from '@/types/api';

type Language = 'pl' | 'en' | 'de';

interface UIState {
  readonly isDarkMode: boolean;
  readonly language: Language;
  readonly sidebarOpen: boolean;
}

interface DataState {
  readonly machines: readonly Machine[];
  readonly maintenanceTasks: readonly MaintenanceTask[];
  readonly alerts: readonly Alert[];
}

interface LoadingState {
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface AppState extends UIState, DataState, LoadingState {
  // UI Actions
  readonly toggleDarkMode: () => void;
  readonly setLanguage: (lang: Language) => void;
  readonly toggleSidebar: () => void;
  readonly setSidebarOpen: (open: boolean) => void;
  
  // Data Actions  
  readonly setMachines: (machines: readonly Machine[]) => void;
  readonly addMachine: (machine: Machine) => void;
  readonly updateMachine: (id: string, updates: Partial<Machine>) => void;
  readonly removeMachine: (id: string) => void;
  
  readonly setMaintenanceTasks: (tasks: readonly MaintenanceTask[]) => void;
  readonly addMaintenanceTask: (task: MaintenanceTask) => void;
  readonly updateMaintenanceTask: (id: string, updates: Partial<MaintenanceTask>) => void;
  readonly removeMaintenanceTask: (id: string) => void;
  
  readonly setAlerts: (alerts: readonly Alert[]) => void;
  readonly addAlert: (alert: Alert) => void;
  readonly removeAlert: (id: string) => void;
  readonly markAlertAsRead: (id: string) => void;
  
  // Loading Actions
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
  
  // Computed getters
  readonly getUnreadAlerts: () => readonly Alert[];
  readonly getMachinesByStatus: (status: string) => readonly Machine[];
  readonly getOverdueTasks: () => readonly MaintenanceTask[];
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        isDarkMode: false,
        language: 'pl' as const,
        sidebarOpen: true,
        
        machines: [],
        maintenanceTasks: [],
        alerts: [],
        
        isLoading: false,
        error: null,
        
        // UI Actions
        toggleDarkMode: () => 
          set((state) => {
            state.isDarkMode = !state.isDarkMode;
          }),
          
        setLanguage: (lang) => 
          set((state) => {
            state.language = lang;
          }),
          
        toggleSidebar: () => 
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          }),
          
        setSidebarOpen: (open) => 
          set((state) => {
            state.sidebarOpen = open;
          }),
        
        // Data Actions - Machines
        setMachines: (machines) => 
          set((state) => {
            state.machines = machines as any;
          }),
          
        addMachine: (machine) => 
          set((state) => {
            state.machines.push(machine);
          }),
          
        updateMachine: (id, updates) => 
          set((state) => {
            const index = state.machines.findIndex(m => m.id === id);
            if (index !== -1) {
              Object.assign(state.machines[index], updates);
            }
          }),
          
        removeMachine: (id) => 
          set((state) => {
            state.machines = state.machines.filter(m => m.id !== id);
          }),
        
        // Data Actions - Maintenance Tasks
        setMaintenanceTasks: (tasks) => 
          set((state) => {
            state.maintenanceTasks = tasks as any;
          }),
          
        addMaintenanceTask: (task) => 
          set((state) => {
            state.maintenanceTasks.push(task);
          }),
          
        updateMaintenanceTask: (id, updates) => 
          set((state) => {
            const index = state.maintenanceTasks.findIndex(t => t.id === id);
            if (index !== -1) {
              Object.assign(state.maintenanceTasks[index], updates);
            }
          }),
          
        removeMaintenanceTask: (id) => 
          set((state) => {
            state.maintenanceTasks = state.maintenanceTasks.filter(t => t.id !== id);
          }),
        
        // Data Actions - Alerts
        setAlerts: (alerts) => 
          set((state) => {
            state.alerts = alerts as any;
          }),
          
        addAlert: (alert) => 
          set((state) => {
            state.alerts.push(alert);
          }),
          
        removeAlert: (id) => 
          set((state) => {
            state.alerts = state.alerts.filter(a => a.id !== id);
          }),
          
        markAlertAsRead: (id) => 
          set((state) => {
            const alert = state.alerts.find(a => a.id === id);
            if (alert) {
              alert.isRead = true;
            }
          }),
        
        // Loading Actions
        setLoading: (loading) => 
          set((state) => {
            state.isLoading = loading;
          }),
          
        setError: (error) => 
          set((state) => {
            state.error = error;
          }),
          
        clearError: () => 
          set((state) => {
            state.error = null;
          }),
        
        // Computed getters
        getUnreadAlerts: () => {
          const { alerts } = get();
          return alerts.filter(alert => !alert.isRead);
        },
        
        getMachinesByStatus: (status) => {
          const { machines } = get();
          return machines.filter(machine => machine.status === status);
        },
        
        getOverdueTasks: () => {
          const { maintenanceTasks } = get();
          const now = new Date();
          return maintenanceTasks.filter(task => 
            task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed'
          );
        }
      })),
      {
        name: 'app-storage',
        partialize: (state) => ({
          isDarkMode: state.isDarkMode,
          language: state.language,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'app-store' }
  )
); 