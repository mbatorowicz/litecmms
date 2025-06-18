import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ApiResponse, Machine, MaintenanceTask, Alert } from '@/types/api';

// Query Keys
export const queryKeys = {
  machines: ['machines'] as const,
  maintenanceTasks: ['maintenanceTasks'] as const,
  alerts: ['alerts'] as const,
  machine: (id: string) => ['machine', id] as const,
  task: (id: string) => ['task', id] as const,
};

// Hooks
export function useMachines(options?: UseQueryOptions<ApiResponse<Machine[]>>) {
  return useQuery({
    queryKey: queryKeys.machines,
    queryFn: () => apiClient.get<Machine[]>('/api/machines'),
    ...options,
  });
}

export function useMachine(id: string, options?: UseQueryOptions<ApiResponse<Machine>>) {
  return useQuery({
    queryKey: queryKeys.machine(id),
    queryFn: () => apiClient.get<Machine>(`/api/machines/${id}`),
    ...options,
  });
}

export function useMaintenanceTasks(options?: UseQueryOptions<ApiResponse<MaintenanceTask[]>>) {
  return useQuery({
    queryKey: queryKeys.maintenanceTasks,
    queryFn: () => apiClient.get<MaintenanceTask[]>('/api/maintenance-tasks'),
    ...options,
  });
}

export function useAlerts(options?: UseQueryOptions<ApiResponse<Alert[]>>) {
  return useQuery({
    queryKey: queryKeys.alerts,
    queryFn: () => apiClient.get<Alert[]>('/api/alerts'),
    ...options,
  });
}

// Mutations
export function useCreateMachine(options?: UseMutationOptions<ApiResponse<Machine>, Error, Partial<Machine>>) {
  return useMutation({
    mutationFn: (data) => apiClient.post<Machine>('/api/machines', data),
    ...options,
  });
}

export function useUpdateMachine(options?: UseMutationOptions<ApiResponse<Machine>, Error, { id: string; data: Partial<Machine> }>) {
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.put<Machine>(`/api/machines/${id}`, data),
    ...options,
  });
}

export function useCreateMaintenanceTask(options?: UseMutationOptions<ApiResponse<MaintenanceTask>, Error, Partial<MaintenanceTask>>) {
  return useMutation({
    mutationFn: (data) => apiClient.post<MaintenanceTask>('/api/maintenance-tasks', data),
    ...options,
  });
}

export function useUpdateMaintenanceTask(options?: UseMutationOptions<ApiResponse<MaintenanceTask>, Error, { id: string; data: Partial<MaintenanceTask> }>) {
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.put<MaintenanceTask>(`/api/maintenance-tasks/${id}`, data),
    ...options,
  });
}

export function useResolveAlert(options?: UseMutationOptions<ApiResponse<Alert>, Error, string>) {
  return useMutation({
    mutationFn: (id) => apiClient.put<Alert>(`/api/alerts/${id}/resolve`),
    ...options,
  });
} 