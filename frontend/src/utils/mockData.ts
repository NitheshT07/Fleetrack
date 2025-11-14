import { Vehicle, Expense, Revenue, DashboardKPI, MonthlyData } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    vehicleNo: 'TN-01-AB-1234',
    type: 'Truck',
    model: 'Tata LPT 1613',
    purchaseDate: '2022-03-15',
    insuranceExpiry: '2025-11-30',
    status: 'Active',
    totalRevenue: 450000,
    totalExpenses: 285000,
    profit: 165000
  },
  {
    id: '2',
    vehicleNo: 'TN-02-CD-5678',
    type: 'Van',
    model: 'Mahindra Bolero Pickup',
    purchaseDate: '2021-08-20',
    insuranceExpiry: '2025-12-15',
    status: 'Active',
    totalRevenue: 320000,
    totalExpenses: 198000,
    profit: 122000
  },
  {
    id: '3',
    vehicleNo: 'KA-03-EF-9012',
    type: 'Truck',
    model: 'Ashok Leyland 1616',
    purchaseDate: '2023-01-10',
    insuranceExpiry: '2026-01-09',
    status: 'Active',
    totalRevenue: 580000,
    totalExpenses: 342000,
    profit: 238000
  },
  {
    id: '4',
    vehicleNo: 'MH-04-GH-3456',
    type: 'Container',
    model: 'Volvo FM 440',
    purchaseDate: '2020-06-25',
    insuranceExpiry: '2025-10-20',
    status: 'Maintenance',
    totalRevenue: 890000,
    totalExpenses: 545000,
    profit: 345000
  },
  {
    id: '5',
    vehicleNo: 'DL-05-IJ-7890',
    type: 'Truck',
    model: 'BharatBenz 1617R',
    purchaseDate: '2022-11-05',
    insuranceExpiry: '2026-02-28',
    status: 'Active',
    totalRevenue: 410000,
    totalExpenses: 256000,
    profit: 154000
  },
  {
    id: '6',
    vehicleNo: 'GJ-06-KL-2345',
    type: 'Van',
    model: 'Force Traveller',
    purchaseDate: '2023-04-18',
    insuranceExpiry: '2026-04-17',
    status: 'Active',
    totalRevenue: 280000,
    totalExpenses: 175000,
    profit: 105000
  }
];

export const mockExpenses: Expense[] = [
  { id: '1', vehicleId: '1', vehicleNo: 'TN-01-AB-1234', category: 'Fuel', amount: 45000, date: '2025-10-15', kmReading: 12500, supplier: 'Shell Petrol Pump' },
  { id: '2', vehicleId: '1', vehicleNo: 'TN-01-AB-1234', category: 'Spare Parts', amount: 18500, date: '2025-10-12', supplier: 'Auto Parts Store' },
  { id: '3', vehicleId: '2', vehicleNo: 'TN-02-CD-5678', category: 'Employee Salary', amount: 35000, date: '2025-10-01', notes: 'Driver salary for October' },
  { id: '4', vehicleId: '3', vehicleNo: 'KA-03-EF-9012', category: 'Fuel', amount: 52000, date: '2025-10-16', kmReading: 15200 },
  { id: '5', vehicleId: '4', vehicleNo: 'MH-04-GH-3456', category: 'Maintenance', amount: 125000, date: '2025-10-10', notes: 'Engine overhaul' },
  { id: '6', vehicleId: '1', vehicleNo: 'TN-01-AB-1234', category: 'Insurance', amount: 45000, date: '2025-09-20', notes: 'Annual insurance renewal' },
  { id: '7', vehicleId: '5', vehicleNo: 'DL-05-IJ-7890', category: 'Fuel', amount: 38000, date: '2025-10-14', kmReading: 11000 },
  { id: '8', vehicleId: '2', vehicleNo: 'TN-02-CD-5678', category: 'Spare Parts', amount: 12500, date: '2025-10-08', supplier: 'Local Mechanic' },
  { id: '9', vehicleId: '6', vehicleNo: 'GJ-06-KL-2345', category: 'Fuel', amount: 28000, date: '2025-10-17', kmReading: 8500 },
  { id: '10', vehicleId: '3', vehicleNo: 'KA-03-EF-9012', category: 'Employee Salary', amount: 38000, date: '2025-10-01' }
];

export const mockRevenue: Revenue[] = [
  { id: '1', vehicleId: '1', vehicleNo: 'TN-01-AB-1234', tripId: 'TR001', amount: 85000, date: '2025-10-15', startLocation: 'Chennai', endLocation: 'Bangalore', distance: 350 },
  { id: '2', vehicleId: '2', vehicleNo: 'TN-02-CD-5678', tripId: 'TR002', amount: 52000, date: '2025-10-14', startLocation: 'Mumbai', endLocation: 'Pune', distance: 150 },
  { id: '3', vehicleId: '3', vehicleNo: 'KA-03-EF-9012', tripId: 'TR003', amount: 120000, date: '2025-10-13', startLocation: 'Delhi', endLocation: 'Jaipur', distance: 280 },
  { id: '4', vehicleId: '1', vehicleNo: 'TN-01-AB-1234', tripId: 'TR004', amount: 95000, date: '2025-10-10', startLocation: 'Bangalore', endLocation: 'Hyderabad', distance: 570 },
  { id: '5', vehicleId: '4', vehicleNo: 'MH-04-GH-3456', tripId: 'TR005', amount: 180000, date: '2025-10-08', startLocation: 'Mumbai', endLocation: 'Delhi', distance: 1450 },
  { id: '6', vehicleId: '5', vehicleNo: 'DL-05-IJ-7890', tripId: 'TR006', amount: 78000, date: '2025-10-16', startLocation: 'Kolkata', endLocation: 'Bhubaneswar', distance: 440 },
  { id: '7', vehicleId: '6', vehicleNo: 'GJ-06-KL-2345', tripId: 'TR007', amount: 65000, date: '2025-10-17', startLocation: 'Ahmedabad', endLocation: 'Surat', distance: 265 },
  { id: '8', vehicleId: '2', vehicleNo: 'TN-02-CD-5678', tripId: 'TR008', amount: 48000, date: '2025-10-12', startLocation: 'Pune', endLocation: 'Nashik', distance: 210 }
];

export const mockMonthlyData: MonthlyData[] = [
  { month: 'Nov 24', revenue: 520000, expense: 320000 },
  { month: 'Dec 24', revenue: 580000, expense: 345000 },
  { month: 'Jan 25', revenue: 610000, expense: 365000 },
  { month: 'Feb 25', revenue: 590000, expense: 355000 },
  { month: 'Mar 25', revenue: 650000, expense: 385000 },
  { month: 'Apr 25', revenue: 680000, expense: 410000 },
  { month: 'May 25', revenue: 720000, expense: 430000 },
  { month: 'Jun 25', revenue: 700000, expense: 425000 },
  { month: 'Jul 25', revenue: 740000, expense: 445000 },
  { month: 'Aug 25', revenue: 780000, expense: 465000 },
  { month: 'Sep 25', revenue: 820000, expense: 490000 },
  { month: 'Oct 25', revenue: 850000, expense: 510000 }
];

export const getDashboardKPI = (): DashboardKPI => {
  const currentMonthRevenue = mockRevenue
    .filter(r => new Date(r.date).getMonth() === 9) // October
    .reduce((sum, r) => sum + r.amount, 0);
  
  const currentMonthExpenses = mockExpenses
    .filter(e => new Date(e.date).getMonth() === 9)
    .reduce((sum, e) => sum + e.amount, 0);

  return {
    totalRevenueMTD: currentMonthRevenue,
    totalExpensesMTD: currentMonthExpenses,
    profitMTD: currentMonthRevenue - currentMonthExpenses,
    activeVehicles: mockVehicles.filter(v => v.status === 'Active').length
  };
};

export const getVehicleExpenses = (vehicleId: string) => {
  return mockExpenses.filter(e => e.vehicleId === vehicleId);
};

export const getVehicleRevenue = (vehicleId: string) => {
  return mockRevenue.filter(r => r.vehicleId === vehicleId);
};

export const getExpensesByCategory = () => {
  const categories = ['Fuel', 'Spare Parts', 'Employee Salary', 'Maintenance', 'Insurance', 'Others'];
  return categories.map(category => ({
    name: category,
    value: mockExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0)
  }));
};

export const getVehicleWiseExpenses = () => {
  return mockVehicles.slice(0, 6).map(vehicle => {
    const thisMonth = mockExpenses
      .filter(e => e.vehicleId === vehicle.id && new Date(e.date).getMonth() === 9)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const lastMonth = Math.floor(thisMonth * (0.8 + Math.random() * 0.4));
    
    return {
      vehicleNo: vehicle.vehicleNo,
      thisMonth,
      lastMonth
    };
  });
};
