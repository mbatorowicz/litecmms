// API Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'technician' | 'user';
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  locationId: string;
  status: 'operational' | 'maintenance' | 'down' | 'retired';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  machineId?: string;
  assignedToId?: string;
  createdById: string;
  companyId: string;
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common Utilities
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'operational':
    case 'completed':
      return 'green';
    case 'maintenance':
    case 'in_progress':
      return 'yellow';
    case 'down':
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
}; 