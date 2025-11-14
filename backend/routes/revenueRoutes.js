// // backend/routes/revenueRoutes.js
// import express from "express";
// import Revenue from "../models/Revenue.js";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const r = new Revenue(req.body);
//     await r.save();
//     res.status(201).json(r);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// router.get("/", async (req, res) => {
//   const list = await Revenue.find().sort({ date: -1 });
//   res.json(list);
// });

// router.get("/:id", async (req, res) => {
//   const r = await Revenue.findById(req.params.id);
//   if (!r) return res.status(404).json({ message: "Not found" });
//   res.json(r);
// });

// router.put("/:id", async (req, res) => {
//   const r = await Revenue.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(r);
// });

// router.delete("/:id", async (req, res) => {
//   await Revenue.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// });

// export default router;


import express from "express";
import Revenue from "../models/Revenue.js";

const router = express.Router();

/* -----------------------------------------------------
   ADD REVENUE TRIP
------------------------------------------------------*/
router.post("/", async (req, res) => {
  try {
    const revenue = await Revenue.create(req.body);

    // Send email notification and create notification
    try {
      const User = (await import("../models/User.js")).default;
      const Notification = (await import("../models/Notification.js")).default;
      const { notifyRevenueAdded } = await import("../utils/emailService.js");

      // Get all admin users to notify
      const adminUsers = await User.find({ role: "Admin" });
      
      for (const user of adminUsers) {
        // Send email notification
        await notifyRevenueAdded(user.email, user.name, revenue.toObject());

        // Create notification in database
        await Notification.create({
          userId: user._id,
          type: "revenue_added",
          title: "New Revenue Recorded",
          message: `New revenue of ₹${revenue.amount} (Trip: ${revenue.tripId}) has been recorded.`,
          metadata: { revenueId: revenue._id, vehicleId: revenue.vehicleId },
        });
      }
    } catch (notifError) {
      console.error("Error sending notification:", notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      success: true,
      data: revenue,
    });
  } catch (err) {
    console.error("Add Revenue Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* -----------------------------------------------------
   GET ALL REVENUES
   /api/revenues
------------------------------------------------------*/
router.get("/", async (req, res) => {
  try {
    const revenues = await Revenue.find().sort({ date: -1 });

    res.json({
      success: true,
      data: revenues,
    });
  } catch (err) {
    console.error("Fetch Revenue Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* -----------------------------------------------------
   GET ALL REVENUE FOR SPECIFIC VEHICLE
   /api/revenues/:vehicleId
------------------------------------------------------*/
router.get("/:vehicleId", async (req, res) => {
  try {
    // Check if vehicleId is a valid MongoDB ObjectId
    const mongoose = (await import("mongoose")).default;
    if (mongoose.Types.ObjectId.isValid(req.params.vehicleId)) {
      const revenues = await Revenue.find({
        vehicleId: req.params.vehicleId,
      }).sort({ date: -1 });

      res.json({
        success: true,
        data: revenues,
      });
    } else {
      // If not a valid ObjectId, treat as revenue ID
      const revenue = await Revenue.findById(req.params.vehicleId);
      if (!revenue) {
        return res.status(404).json({
          success: false,
          message: "Revenue not found",
        });
      }
      res.json({
        success: true,
        data: revenue,
      });
    }
  } catch (err) {
    console.error("Fetch Revenue Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* -----------------------------------------------------
   UPDATE REVENUE ENTRY
------------------------------------------------------*/
router.put("/:id", async (req, res) => {
  try {
    const revenue = await Revenue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!revenue) {
      return res.status(404).json({
        success: false,
        message: "Revenue not found",
      });
    }

    res.json({
      success: true,
      message: "Revenue updated successfully",
      data: revenue,
    });
  } catch (err) {
    console.error("Update Revenue Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* -----------------------------------------------------
   DELETE REVENUE ENTRY
------------------------------------------------------*/
router.delete("/delete/:id", async (req, res) => {
  try {
    const revenue = await Revenue.findByIdAndDelete(req.params.id);

    if (!revenue) {
      return res.status(404).json({
        success: false,
        message: "Revenue not found",
      });
    }

    res.json({
      success: true,
      message: "Revenue record deleted",
    });
  } catch (err) {
    console.error("Delete Revenue Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
