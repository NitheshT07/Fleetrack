// // backend/controllers/dashboardController.js
// import Vehicle from "../models/Vehicle.js";
// import Expense from "../models/Expense.js";
// import Revenue from "../models/Revenue.js";

// export const getDashboardStats = async (req, res) => {
//   try {
//     // totals
//     const revenueAgg = await Revenue.aggregate([
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);
//     const expenseAgg = await Expense.aggregate([
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);

//     const totalRevenue = revenueAgg[0]?.total || 0;
//     const totalExpenses = expenseAgg[0]?.total || 0;
//     const profit = totalRevenue - totalExpenses;

//     // active vehicles
//     const activeVehicles = await Vehicle.countDocuments({ status: "active" });

//     // expense breakdown by category
//     const expenseBreakdown = await Expense.aggregate([
//       { $group: { _id: "$category", total: { $sum: "$amount" } } },
//       { $sort: { total: -1 } }
//     ]);

//     // monthly revenue & expense for last 12 months (month-year)
//     const now = new Date();
//     const from = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 months ago

//     const monthlyRevenue = await Revenue.aggregate([
//       { $match: { date: { $gte: from } } },
//       {
//         $group: {
//           _id: { year: { $year: "$date" }, month: { $month: "$date" } },
//           total: { $sum: "$amount" }
//         }
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } }
//     ]);

//     const monthlyExpense = await Expense.aggregate([
//       { $match: { date: { $gte: from } } },
//       {
//         $group: {
//           _id: { year: { $year: "$date" }, month: { $month: "$date" } },
//           total: { $sum: "$amount" }
//         }
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } }
//     ]);

//     // Normalize monthly series to last 12 months labels
//     const months = [];
//     const monthMap = {}; // "YYYY-MM" -> { revenue, expense }
//     for (let i = 11; i >= 0; i--) {
//       const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
//       months.push(key);
//       monthMap[key] = { revenue: 0, expense: 0 };
//     }

//     monthlyRevenue.forEach((m) => {
//       const key = `${m._id.year}-${String(m._id.month).padStart(2, "0")}`;
//       if (monthMap[key]) monthMap[key].revenue = m.total;
//     });
//     monthlyExpense.forEach((m) => {
//       const key = `${m._id.year}-${String(m._id.month).padStart(2, "0")}`;
//       if (monthMap[key]) monthMap[key].expense = m.total;
//     });

//     const monthlyData = months.map((key) => ({
//       month: key,
//       revenue: monthMap[key].revenue,
//       expense: monthMap[key].expense
//     }));

//     res.json({
//       totalRevenue,
//       totalExpenses,
//       profit,
//       activeVehicles,
//       expenseBreakdown,
//       monthlyData
//     });
//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };



// // /controllers/dashboardController.js
// import Vehicle from "../models/Vehicle.js";
// import Expense from "../models/Expense.js";
// import Revenue from "../models/Revenue.js";

// export const getDashboardStats = async (req, res) => {
//   try {
//     const totalRevenue = await Revenue.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
//     const totalExpenses = await Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
//     const profit = (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0);
//     const activeVehicles = await Vehicle.countDocuments({ status: "Active" });

//     const expenseBreakdown = await Expense.aggregate([
//       { $group: { _id: "$category", total: { $sum: "$amount" } } },
//       { $sort: { total: -1 } }
//     ]);

//     const monthlyRevenue = await Revenue.aggregate([
//       { $group: { _id: { month: { $month: "$date" } }, total: { $sum: "$amount" } } },
//       { $sort: { "_id.month": 1 } }
//     ]);

//     const monthlyExpenses = await Expense.aggregate([
//       { $group: { _id: { month: { $month: "$date" } }, total: { $sum: "$amount" } } },
//       { $sort: { "_id.month": 1 } }
//     ]);

//     res.json({
//       totalRevenue: totalRevenue[0]?.total || 0,
//       totalExpenses: totalExpenses[0]?.total || 0,
//       profit,
//       activeVehicles,
//       expenseBreakdown,
//       monthlyData: { revenue: monthlyRevenue, expense: monthlyExpenses }
//     });
//   } catch (error) {
//     console.error("Dashboard error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };



import Vehicle from "../models/Vehicle.js";
import Expense from "../models/Expense.js";
import Revenue from "../models/Revenue.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Totals
    const revenueAgg = await Revenue.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const expenseAgg = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;
    const profit = totalRevenue - totalExpenses;

    // Active Vehicles
    const activeVehicles = await Vehicle.countDocuments({ status: "Active" });

    // Expense breakdown by category
    const expenseBreakdown = await Expense.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    // Monthly revenue & expenses (last 12 months)
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const monthlyRevenue = await Revenue.aggregate([
      { $match: { date: { $gte: from } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthlyExpense = await Expense.aggregate([
      { $match: { date: { $gte: from } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // ✅ Normalize both into an array with all months
    const months = [];
    const monthMap = {}; // "YYYY-MM" -> { revenue, expense }

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push(key);
      monthMap[key] = { revenue: 0, expense: 0 };
    }

    monthlyRevenue.forEach((m) => {
      const key = `${m._id.year}-${String(m._id.month).padStart(2, "0")}`;
      if (monthMap[key]) monthMap[key].revenue = m.total;
    });

    monthlyExpense.forEach((m) => {
      const key = `${m._id.year}-${String(m._id.month).padStart(2, "0")}`;
      if (monthMap[key]) monthMap[key].expense = m.total;
    });

    const monthlyData = months.map((key) => ({
      month: key,
      revenue: monthMap[key].revenue,
      expense: monthMap[key].expense,
    }));

    // ✅ Send response with uniform format
    res.json({
      success: true,
      totalRevenue,
      totalExpenses,
      profit,
      activeVehicles,
      expenseBreakdown,
      monthlyData, // <-- NOW an array, always safe to .map()
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};
