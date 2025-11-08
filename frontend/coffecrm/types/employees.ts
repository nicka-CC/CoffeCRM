export type Role = 'ADMIN' | 'READ' | 'EDITE' | 'WRITE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: Role;
  icon?: string | null;
}

export interface KPI {
  id: string;
  employeeId: string;
  metric: string;
  value: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  id: string;
  userId: string;
  position: string;
  salary?: number | null;
  branchId?: string | null;
  hiredAt?: string;
  createdAt?: string;
  updatedAt?: string;
  user: User;
  branch?: {
    id: string;
    name: string;
    city: string;
  } | null;
  kpis?: KPI[];
}

export interface CreateEmployeeDto {
  userId: string;
  position: string;
  salary?: number;
  branchId?: string;
}

export interface UpdateEmployeeDto {
  position?: string;
  salary?: number;
  branchId?: string;
}

export interface EmployeeKPI {
  period: string;
  metrics: Array<{
    metric: string;
    value: number;
    date: string;
  }>;
  summary: {
    totalOrders?: number;
    totalRevenue?: number;
    averageCheck?: number;
  };
}

