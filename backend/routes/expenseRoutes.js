// // backend/routes/expenseRoutes.js
// import express from "express";
// import Expense from "../models/Expense.js";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const e = new Expense(req.body);
//     await e.save();
//     res.status(201).json(e);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// router.get("/", async (req, res) => {
//   const list = await Expense.find().sort({ date: -1 });
//   res.json(list);
// });

// router.get("/:id", async (req, res) => {
//   const e = await Expense.findById(req.params.id);
//   if (!e) return res.status(404).json({ message: "Not found" });
//   res.json(e);
// });

// router.put("/:id", async (req, res) => {
//   const e = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(e);
// });

// router.delete("/:id", async (req, res) => {
//   await Expense.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// });

// export default router;


import express from "express";
import Expense from "../models/Expense.js";

const router = express.Router();

/* -------------------------------------------
   ADD EXPENSE
----------------------------------------------*/
router.post("/", async (req, res) => {
  try {
    const expense = await Expense.create(req.body);

    // Send email notification and create notification
    try {
      const User = (await import("../models/User.js")).default;
      const Notification = (await import("../models/Notification.js")).default;
      const { notifyExpenseAdded } = await import("../utils/emailService.js");

      // Get all admin users to notify
      const adminUsers = await User.find({ role: "Admin" });
      
      for (const user of adminUsers) {
        // Send email notification
        await notifyExpenseAdded(user.email, user.name, expense.toObject());

        // Create notification in database
        await Notification.create({
          userId: user._id,
          type: "expense_added",
          title: "New Expense Recorded",
          message: `New expense of ₹${expense.amount} (${expense.category}) has been recorded.`,
          metadata: { expenseId: expense._id, vehicleId: expense.vehicleId },
        });
      }
    } catch (notifError) {
      console.error("Error sending notification:", notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    console.error("Add Expense Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* -------------------------------------------
   ADD EXPENSE FOR SPECIFIC VEHICLE
   /api/expenses/:vehicleId (POST)
----------------------------------------------*/
router.post("/:vehicleId", async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      vehicleId: req.params.vehicleId,
    });

    // Send email notification and create notification
    try {
      const User = (await import("../models/User.js")).default;
      const Notification = (await import("../models/Notification.js")).default;
      const { notifyExpenseAdded } = await import("../utils/emailService.js");

      // Get all admin users to notify
      const adminUsers = await User.find({ role: "Admin" });
      
      for (const user of adminUsers) {
        // Send email notification
        await notifyExpenseAdded(user.email, user.name, expense.toObject());

        // Create notification in database
        await Notification.create({
          userId: user._id,
          type: "expense_added",
          title: "New Expense Recorded",
          message: `New expense of ₹${expense.amount} (${expense.category}) has been recorded.`,
          metadata: { expenseId: expense._id, vehicleId: expense.vehicleId },
        });
      }
    } catch (notifError) {
      console.error("Error sending notification:", notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    console.error("Add Expense Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* -------------------------------------------
   GET ALL EXPENSES
   /api/expenses
----------------------------------------------*/
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });

    res.json({
      success: true,
      data: expenses,
    });
  } catch (err) {
    console.error("Fetch Expenses Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* -------------------------------------------
   GET EXPENSES FOR SPECIFIC VEHICLE
   /api/expenses/:vehicleId (GET)
----------------------------------------------*/
router.get("/:vehicleId", async (req, res) => {
  try {
    // Check if vehicleId is a valid MongoDB ObjectId
    const mongoose = (await import("mongoose")).default;
    if (mongoose.Types.ObjectId.isValid(req.params.vehicleId)) {
      const expenses = await Expense.find({ vehicleId: req.params.vehicleId })
        .sort({ date: -1 });

      res.json({
        success: true,
        data: expenses,
      });
    } else {
      // If not a valid ObjectId, treat as expense ID
      const expense = await Expense.findById(req.params.vehicleId);
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }
      res.json({
        success: true,
        data: expense,
      });
    }
  } catch (err) {
    console.error("Fetch Expenses Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* -------------------------------------------
   UPDATE EXPENSE
----------------------------------------------*/
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (err) {
    console.error("Update Expense Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* -------------------------------------------
   DELETE EXPENSE
----------------------------------------------*/
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense deleted",
    });
  } catch (err) {
    console.error("Delete Expense Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
