export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Typy dla endpointów
export interface Machine {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'failure';
  lastMaintenance: Date;
  nextMaintenance: Date;
  oee: number;
  availability: number;
  mttr: number;
  costs: number;
}

export interface MaintenanceTask {
  id: string;
  machineId: string;
  type: 'preventive' | 'corrective' | 'predictive';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  dueDate: Date;
  completedAt?: Date;
  description: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  source: 'machine' | 'maintenance' | 'inventory';
  message: string;
  createdAt: Date;
  resolvedAt?: Date;
  status: 'active' | 'resolved';
  isRead?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  location: string;
  lastRestock: Date;
  supplier: string;
} 