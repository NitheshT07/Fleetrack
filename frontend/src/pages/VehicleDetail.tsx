// import { useEffect, useState } from "react";
// import { motion } from "motion/react";
// import {
//   ArrowLeft,
//   Plus,
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   Edit2,
//   Trash2
// } from "lucide-react";

// import { Button } from "../components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { Badge } from "../components/ui/badge";
// import { KPICard } from "../components/KPICard";
// import { AddExpenseModal } from "../components/AddExpenseModal";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from "../components/ui/table";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";

// interface VehicleDetailProps {
//   vehicleId: string;
//   onNavigate: (page: string) => void;
// }

// export const VehicleDetail = ({ vehicleId, onNavigate }: VehicleDetailProps) => {
//   const [vehicle, setVehicle] = useState<any>(null);
//   const [expenses, setExpenses] = useState<any[]>([]);
//   const [revenue, setRevenue] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [showAddExpense, setShowAddExpense] = useState(false);

//   // 🔥 Load vehicle + expenses + revenue
//   const loadData = async () => {
//     try {
//       const v = await fetch(`http://localhost:5000/api/vehicles/${vehicleId}`).then(res => res.json());
//       const e = await fetch(`http://localhost:5000/api/expenses?vehicleId=${vehicleId}`).then(res => res.json());
//       const r = await fetch(`http://localhost:5000/api/revenues?vehicleId=${vehicleId}`).then(res => res.json());

//       if (v.success) setVehicle(v.data);
//       if (e.success) setExpenses(e.data);
//       if (r.success) setRevenue(r.data);
//     } catch (err) {
//       console.error("Error loading vehicle detail:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [vehicleId]);

//   if (loading) return <div className="p-6">Loading...</div>;

//   if (!vehicle) return <div className="p-6">Vehicle not found</div>;

//   // 🔥 Expense category chart
//   const expenseByCategory = expenses.reduce((acc: any[], exp: any) => {
//     const existing = acc.find((i) => i.name === exp.category);
//     if (existing) existing.value += exp.amount;
//     else acc.push({ name: exp.category, value: exp.amount });
//     return acc;
//   }, []);

//   const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
//       case "Maintenance":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
//       case "Inactive":
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button variant="outline" onClick={() => onNavigate("vehicles")} className="p-2">
//             <ArrowLeft size={20} />
//           </Button>
//           <div>
//             <div className="flex items-center gap-3">
//               <h1 className="text-gray-900 dark:text-white">{vehicle.vehicleNo}</h1>
//               <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
//             </div>
//             <p className="text-gray-600 dark:text-gray-400">
//               {vehicle.model} • {vehicle.type}
//             </p>
//           </div>
//         </div>

//         <Button
//           onClick={() => setShowAddExpense(true)}
//           className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-cyan-500 dark:to-purple-600 text-white shadow-lg"
//         >
//           <Plus className="mr-2" size={20} />
//           Add Expense
//         </Button>
//       </div>

//       {/* KPI CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <KPICard
//           title="Total Revenue"
//           value={`₹${vehicle.totalRevenue || 0}`}
//           icon={TrendingUp}
//           color="green"
//         />
//         <KPICard
//           title="Total Expenses"
//           value={`₹${vehicle.totalExpenses || 0}`}
//           icon={TrendingDown}
//           color="purple"
//         />
//         <KPICard
//           title="Profit"
//           value={`₹${(vehicle.totalRevenue || 0) - (vehicle.totalExpenses || 0)}`}
//           icon={DollarSign}
//           color="cyan"
//         />
//       </div>

//       {/* TABS */}
//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="bg-gray-100 dark:bg-gray-800">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="expenses">Expenses</TabsTrigger>
//         </TabsList>

//         {/* OVERVIEW */}
//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Vehicle Info */}
//             <motion.div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border dark:border-gray-800">
//               <h3 className="text-gray-900 dark:text-white mb-4">Vehicle Info</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span>Vehicle Number</span>
//                   <span>{vehicle.vehicleNo}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Type</span>
//                   <span>{vehicle.type}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Model</span>
//                   <span>{vehicle.model}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Purchase Date</span>
//                   <span>{new Date(vehicle.purchaseDate).toLocaleDateString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Insurance Expiry</span>
//                   <span>{new Date(vehicle.insuranceExpiry).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Expense Breakdown */}
//             <motion.div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border dark:border-gray-800">
//               <h3 className="text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     data={expenseByCategory}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={90}
//                     dataKey="value"
//                   >
//                     {expenseByCategory.map((entry, index) => (
//                       <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </motion.div>
//           </div>
//         </TabsContent>

//         {/* EXPENSES */}
//         <TabsContent value="expenses">
//           <motion.div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border dark:border-gray-800">
//             <h3 className="text-gray-900 dark:text-white mb-4">Expenses</h3>

//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Amount</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenses.map((e) => (
//                   <TableRow key={e._id}>
//                     <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
//                     <TableCell>{e.category}</TableCell>
//                     <TableCell>₹{e.amount}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </motion.div>
//         </TabsContent>
//       </Tabs>

//       <AddExpenseModal
//         open={showAddExpense}
//         onClose={() => {
//           setShowAddExpense(false);
//           loadData();
//         }}
//         vehicleId={vehicleId}
//         vehicleNo={vehicle.vehicleNo}
//       />
//     </div>
//   );
// };


import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { KPICard } from "../components/KPICard";
import { AddExpenseModal } from "../components/AddExpenseModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface VehicleDetailProps {
  vehicleId: string;
  onNavigate: (page: string) => void;
}

export const VehicleDetail = ({ vehicleId, onNavigate }: VehicleDetailProps) => {

  const [vehicle, setVehicle] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddExpense, setShowAddExpense] = useState(false);

  const loadData = async () => {
    try {
      const { vehicleApi } = await import('../api/vehicleApi');
      const { expenseApi } = await import('../api/expenseApi');
      const { revenueApi } = await import('../api/revenueApi');

      const [v, e, r] = await Promise.all([
        vehicleApi.getById(vehicleId),
        expenseApi.getByVehicleId(vehicleId),
        revenueApi.getByVehicleId(vehicleId),
      ]);

      if (v.success) setVehicle(v.data);
      if (e.success) setExpenses(e.data);
      if (r.success) setRevenue(r.data);

    } catch (err) {
      console.error("Error loading vehicle detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [vehicleId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!vehicle) return <div className="p-6">Vehicle not found</div>;

  const expenseByCategory = expenses.reduce((acc: any[], exp: any) => {
    const existing = acc.find((i) => i.name === exp.category);
    if (existing) existing.value += exp.amount;
    else acc.push({ name: exp.category, value: exp.amount });
    return acc;
  }, []);

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => onNavigate("vehicles")} className="p-2">
            <ArrowLeft size={20} />
          </Button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-gray-900 dark:text-white">{vehicle.vehicleNo}</h1>
              <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {vehicle.model} • {vehicle.type}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setShowAddExpense(true)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-cyan-500 dark:to-purple-600 text-white shadow-lg"
        >
          <Plus className="mr-2" size={20} />
          Add Expense
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Revenue"
          value={`₹${vehicle.totalRevenue || 0}`}
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Total Expenses"
          value={`₹${vehicle.totalExpenses || 0}`}
          icon={TrendingDown}
          color="purple"
        />
        <KPICard
          title="Profit"
          value={`₹${(vehicle.totalRevenue || 0) - (vehicle.totalExpenses || 0)}`}
          icon={DollarSign}
          color="cyan"
        />
      </div>

      {/* TABS */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* VEHICLE INFO */}
            <motion.div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border dark:border-gray-800">
              <h3 className="text-gray-900 dark:text-white mb-4">Vehicle Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Vehicle Number</span><span>{vehicle.vehicleNo}</span></div>
                <div className="flex justify-between"><span>Type</span><span>{vehicle.type}</span></div>
                <div className="flex justify-between"><span>Model</span><span>{vehicle.model}</span></div>
                <div className="flex justify-between">
                  <span>Purchase Date</span>
                  <span>{new Date(vehicle.purchaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance Expiry</span>
                  <span>{new Date(vehicle.insuranceExpiry).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>

            {/* EXPENSE BREAKDOWN */}
            <motion.div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border dark:border-gray-800">
              <h3 className="text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

          </div>
        </TabsContent>

        {/* EXPENSE LIST */}
        <TabsContent value="expenses">
          <motion.div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border dark:border-gray-800">
            <h3 className="text-gray-900 dark:text-white mb-4">Expenses</h3>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e._id}>
                    <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell>₹{e.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>

          </motion.div>
        </TabsContent>
      </Tabs>

      <AddExpenseModal
        open={showAddExpense}
        onClose={() => {
          setShowAddExpense(false);
          loadData();
        }}
        vehicleId={vehicleId}
        vehicleNo={vehicle.vehicleNo}
      />
    </div>
  );
};
