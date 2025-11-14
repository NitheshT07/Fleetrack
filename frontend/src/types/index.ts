export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager';
  avatar?: string;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  type: string;
  model: string;
  purchaseDate: string;
  insuranceExpiry: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
  documents?: string[];
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
}

export interface Expense {
  id: string;
  vehicleId: string;
  vehicleNo: string;
  category: 'Fuel' | 'Spare Parts' | 'Employee Salary' | 'Maintenance' | 'Insurance' | 'Others';
  amount: number;
  date: string;
  kmReading?: number;
  supplier?: string;
  notes?: string;
  receipt?: string;
}

export interface Revenue {
  id: string;
  vehicleId: string;
  vehicleNo: string;
  tripId: string;
  amount: number;
  date: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  notes?: string;
}

export interface DashboardKPI {
  totalRevenueMTD: number;
  totalExpensesMTD: number;
  profitMTD: number;
  activeVehicles: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expense: number;
}
