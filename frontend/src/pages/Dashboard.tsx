// import { motion } from 'motion/react';
// import { DollarSign, TrendingDown, TrendingUp, Truck } from 'lucide-react';
// import { KPICard } from '../components/KPICard';
// import { getDashboardKPI, mockMonthlyData, getExpensesByCategory, getVehicleWiseExpenses } from '../utils/mockData';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// export const Dashboard = () => {
//   const kpi = getDashboardKPI();
//   const expensesByCategory = getExpensesByCategory();
//   const vehicleWiseExpenses = getVehicleWiseExpenses();

//   const COLORS = ['#5b68f4', '#ef4464', '#ffa726', '#10d9b4'];

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-gray-900 dark:text-white mb-1">Dashboard</h1>
//         <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your fleet overview.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <KPICard
//           title="Total Revenue"
//           value={`$${(kpi.totalRevenueMTD / 1000).toFixed(0)}k`}
//           icon={DollarSign}
//           trend={12.5}
//           delay={0}
//           color="cyan"
//           subtitle="Month to Date"
//         />
//         <KPICard
//           title="Total Expenses"
//           value={`$${(kpi.totalExpensesMTD / 1000).toFixed(0)}k`}
//           icon={TrendingDown}
//           trend={-6.3}
//           delay={0.1}
//           color="pink"
//           subtitle="Month to Date"
//         />
//         <KPICard
//           title="Profit"
//           value={`$${(kpi.profitMTD / 1000).toFixed(0)}k`}
//           icon={TrendingUp}
//           trend={10.2}
//           delay={0.2}
//           color="green"
//           subtitle="Month to Date"
//         />
//         <KPICard
//           title="Active Vehicles"
//           value={kpi.activeVehicles}
//           icon={Truck}
//           trend={1}
//           delay={0.3}
//           color="purple"
//           subtitle="In Fleet"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.4 }}
//           className="bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/[0.08]"
//         >
//           <div className="mb-6">
//             <h3 className="text-gray-900 dark:text-white">Revenue vs Expense</h3>
//             <p className="text-gray-600 dark:text-gray-400">Last 12 months performance</p>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={mockMonthlyData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
//               <XAxis 
//                 dataKey="month" 
//                 stroke="#9ca3af" 
//                 tick={{ fill: '#9ca3af' }}
//                 axisLine={{ stroke: '#374151', opacity: 0.3 }}
//               />
//               <YAxis 
//                 stroke="#9ca3af" 
//                 tick={{ fill: '#9ca3af' }}
//                 axisLine={{ stroke: '#374151', opacity: 0.3 }}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: 'rgba(26, 27, 46, 0.95)',
//                   border: '1px solid rgba(255, 255, 255, 0.1)',
//                   borderRadius: '8px',
//                   color: '#e8e9f0'
//                 }}
//               />
//               <Legend wrapperStyle={{ color: '#e8e9f0' }} />
//               <Line type="monotone" dataKey="revenue" stroke="#10d9b4" strokeWidth={3} name="Revenue" dot={{ fill: '#10d9b4', r: 4 }} />
//               <Line type="monotone" dataKey="expense" stroke="#ef4464" strokeWidth={3} name="Expense" dot={{ fill: '#ef4464', r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.5 }}
//           className="bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/[0.08]"
//         >
//           <div className="mb-6">
//             <h3 className="text-gray-900 dark:text-white">Expense Breakdown</h3>
//             <p className="text-gray-600 dark:text-gray-400">By category for current month</p>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={expensesByCategory}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {expensesByCategory.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: 'rgba(26, 27, 46, 0.95)',
//                   border: '1px solid rgba(255, 255, 255, 0.1)',
//                   borderRadius: '8px',
//                   color: '#e8e9f0'
//                 }}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </motion.div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.6 }}
//         className="bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/[0.08]"
//       >
//         <div className="mb-6">
//           <h3 className="text-gray-900 dark:text-white">Vehicle-wise Expenses</h3>
//           <p className="text-gray-600 dark:text-gray-400">This Month vs Last Month</p>
//         </div>
//         <ResponsiveContainer width="100%" height={350}>
//           <BarChart data={vehicleWiseExpenses}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
//             <XAxis 
//               dataKey="vehicleNo" 
//               stroke="#9ca3af" 
//               angle={-45} 
//               textAnchor="end" 
//               height={100}
//               tick={{ fill: '#9ca3af' }}
//               axisLine={{ stroke: '#374151', opacity: 0.3 }}
//             />
//             <YAxis 
//               stroke="#9ca3af"
//               tick={{ fill: '#9ca3af' }}
//               axisLine={{ stroke: '#374151', opacity: 0.3 }}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: 'rgba(26, 27, 46, 0.95)',
//                 border: '1px solid rgba(255, 255, 255, 0.1)',
//                 borderRadius: '8px',
//                 color: '#e8e9f0'
//               }}
//             />
//             <Legend wrapperStyle={{ color: '#e8e9f0' }} />
//             <Bar dataKey="lastMonth" fill="#5b68f4" name="Last Month" radius={[8, 8, 0, 0]} />
//             <Bar dataKey="thisMonth" fill="#a78bfa" name="This Month" radius={[8, 8, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </motion.div>
//     </div>
//   );
// };



import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { DollarSign, TrendingDown, TrendingUp, Truck } from "lucide-react";
import { KPICard } from "../components/KPICard";
import { dashboardApi } from "../api/dashboardApi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const COLORS = ["#5b68f4", "#ef4464", "#ffa726", "#10d9b4"];

  // ✅ Fetch dashboard data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardApi.getStats();
        setStats(response);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle loading and errors
  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="p-6 text-red-500">Failed to load dashboard data</div>;

  // ✅ Map backend data into local variables
  const kpi = {
    totalRevenueMTD: stats.totalRevenue || 0,
    totalExpensesMTD: stats.totalExpenses || 0,
    profitMTD: stats.profit || 0,
    activeVehicles: stats.activeVehicles || 0,
  };

  const mockMonthlyData = stats.monthlyData?.map((m: any) => ({
    month: m.month,
    revenue: m.revenue,
    expense: m.expense,
  })) || [];

  const expensesByCategory = stats.expenseBreakdown?.map((e: any) => ({
    name: e._id,
    value: e.total,
  })) || [];

  const vehicleWiseExpenses =
    stats.monthlyData?.map((m: any) => ({
      vehicleNo: m.month,
      thisMonth: m.revenue,
      lastMonth: m.expense,
    })) || [];

  // ✅ UI Rendering
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's your fleet overview.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={`$${(kpi.totalRevenueMTD / 1000).toFixed(0)}k`}
          icon={DollarSign}
          trend={12.5}
          delay={0}
          color="cyan"
          subtitle="Month to Date"
        />
        <KPICard
          title="Total Expenses"
          value={`$${(kpi.totalExpensesMTD / 1000).toFixed(0)}k`}
          icon={TrendingDown}
          trend={-6.3}
          delay={0.1}
          color="pink"
          subtitle="Month to Date"
        />
        <KPICard
          title="Profit"
          value={`$${(kpi.profitMTD / 1000).toFixed(0)}k`}
          icon={TrendingUp}
          trend={10.2}
          delay={0.2}
          color="green"
          subtitle="Month to Date"
        />
        <KPICard
          title="Active Vehicles"
          value={kpi.activeVehicles}
          icon={Truck}
          trend={1}
          delay={0.3}
          color="purple"
          subtitle="In Fleet"
        />
      </div>

      {/* REVENUE VS EXPENSE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/[0.08]"
        >
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-white">Revenue vs Expense</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Last 12 months performance
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af" }}
                axisLine={{ stroke: "#374151", opacity: 0.3 }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af" }}
                axisLine={{ stroke: "#374151", opacity: 0.3 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(26, 27, 46, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#e8e9f0",
                }}
              />
              <Legend wrapperStyle={{ color: "#e8e9f0" }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10d9b4"
                strokeWidth={3}
                name="Revenue"
                dot={{ fill: "#10d9b4", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4464"
                strokeWidth={3}
                name="Expense"
                dot={{ fill: "#ef4464", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* EXPENSE BREAKDOWN PIE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/[0.08]"
        >
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-white">Expense Breakdown</h3>
            <p className="text-gray-600 dark:text-gray-400">
              By category for current month
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(26, 27, 46, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#e8e9f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* VEHICLE-WISE EXPENSE BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/[0.08]"
      >
        <div className="mb-6">
          <h3 className="text-gray-900 dark:text-white">Vehicle-wise Expenses</h3>
          <p className="text-gray-600 dark:text-gray-400">This Month vs Last Month</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={vehicleWiseExpenses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              dataKey="vehicleNo"
              stroke="#9ca3af"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: "#9ca3af" }}
              axisLine={{ stroke: "#374151", opacity: 0.3 }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              axisLine={{ stroke: "#374151", opacity: 0.3 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(26, 27, 46, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#e8e9f0",
              }}
            />
            <Legend wrapperStyle={{ color: "#e8e9f0" }} />
            <Bar dataKey="lastMonth" fill="#5b68f4" name="Last Month" radius={[8, 8, 0, 0]} />
            <Bar dataKey="thisMonth" fill="#a78bfa" name="This Month" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
