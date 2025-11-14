// // backend/routes/vehicleRoutes.js
// import express from "express";
// import Vehicle from "../models/Vehicle.js";

// const router = express.Router();

// // Create
// router.post("/", async (req, res) => {
//   try {
//     const v = new Vehicle(req.body);
//     await v.save();
//     res.status(201).json(v);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Read all
// router.get("/", async (req, res) => {
//   const list = await Vehicle.find().sort({ createdAt: -1 });
//   res.json(list);
// });

// // Read one
// router.get("/:id", async (req, res) => {
//   const v = await Vehicle.findById(req.params.id);
//   if (!v) return res.status(404).json({ message: "Not found" });
//   res.json(v);
// });

// // Update
// router.put("/:id", async (req, res) => {
//   try {
//     const v = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(v);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Delete
// router.delete("/:id", async (req, res) => {
//   await Vehicle.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// });

// export default router;


// import express from "express";
// import Vehicle from "../models/Vehicle.js";

// const router = express.Router();

// // 🚗 Add a new vehicle
// router.post("/", async (req, res) => {
//   try {
//     const { vehicleNo, type, model, purchaseDate, insuranceExpiry, status, documents } = req.body;

//     // Basic validation
//     if (!vehicleNo || !type || !model || !purchaseDate || !insuranceExpiry) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields.",
//       });
//     }

//     // Check if vehicle already exists
//     const existingVehicle = await Vehicle.findOne({ vehicleNo });
//     if (existingVehicle) {
//       return res.status(409).json({
//         success: false,
//         message: "Vehicle with this number already exists.",
//       });
//     }

//     const newVehicle = new Vehicle({
//       vehicleNo,
//       type,
//       model,
//       purchaseDate,
//       insuranceExpiry,
//       status: status || "Active",
//       documents,
//     });

//     const savedVehicle = await newVehicle.save();
//     res.status(201).json({
//       success: true,
//       message: "Vehicle added successfully.",
//       data: savedVehicle,
//     });
//   } catch (err) {
//     console.error("Error adding vehicle:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to add vehicle.",
//       error: err.message,
//     });
//   }
// });

// // 📋 Get all vehicles
// router.get("/", async (req, res) => {
//   try {
//     const vehicles = await Vehicle.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: vehicles.length,
//       data: vehicles,
//     });
//   } catch (err) {
//     console.error("Error fetching vehicles:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to retrieve vehicles.",
//       error: err.message,
//     });
//   }
// });

// // ✏️ Update vehicle
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });

//     if (!updatedVehicle) {
//       return res.status(404).json({
//         success: false,
//         message: "Vehicle not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Vehicle updated successfully.",
//       data: updatedVehicle,
//     });
//   } catch (err) {
//     console.error("Error updating vehicle:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update vehicle.",
//       error: err.message,
//     });
//   }
// });

// // 🗑️ Delete vehicle
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);

//     if (!deletedVehicle) {
//       return res.status(404).json({
//         success: false,
//         message: "Vehicle not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Vehicle deleted successfully.",
//     });
//   } catch (err) {
//     console.error("Error deleting vehicle:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete vehicle.",
//       error: err.message,
//     });
//   }
// });







import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

// 🚗 Add a new vehicle
router.post("/add", async (req, res) => {
  try {
    const {
      vehicleNo,
      type,
      model,
      purchaseDate,
      insuranceExpiry,
      status,
      documents
    } = req.body;

    if (!vehicleNo || !type || !model || !purchaseDate || !insuranceExpiry) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const existing = await Vehicle.findOne({ vehicleNo });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Vehicle with this number already exists.",
      });
    }

    const newVehicle = new Vehicle({
      vehicleNo,
      type,
      model,
      purchaseDate,
      insuranceExpiry,
      status: status || "Active",
      documents,
    });

    const saved = await newVehicle.save();

    // Send email notification and create notification
    try {
      const User = (await import("../models/User.js")).default;
      const Notification = (await import("../models/Notification.js")).default;
      const { notifyVehicleAdded } = await import("../utils/emailService.js");

      // Get all admin users to notify
      const adminUsers = await User.find({ role: "Admin" });
      
      for (const user of adminUsers) {
        // Send email notification
        await notifyVehicleAdded(user.email, user.name, saved.toObject());

        // Create notification in database
        await Notification.create({
          userId: user._id,
          type: "vehicle_added",
          title: "New Vehicle Added",
          message: `Vehicle ${saved.vehicleNo} (${saved.model}) has been added to the fleet.`,
          metadata: { vehicleId: saved._id },
        });
      }
    } catch (notifError) {
      console.error("Error sending notification:", notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully.",
      data: saved,
    });

  } catch (err) {
    console.error("Error adding vehicle:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add vehicle.",
      error: err.message,
    });
  }
});

// 📋 Get all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    
    // Calculate totalRevenue, totalExpenses, and profit for each vehicle
    const Expense = (await import("../models/Expense.js")).default;
    const Revenue = (await import("../models/Revenue.js")).default;
    
    const vehiclesWithStats = await Promise.all(
      vehicles.map(async (vehicle) => {
        const expenses = await Expense.aggregate([
          { $match: { vehicleId: vehicle._id } },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const revenues = await Revenue.aggregate([
          { $match: { vehicleId: vehicle._id } },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        const totalExpenses = expenses[0]?.total || 0;
        const totalRevenue = revenues[0]?.total || 0;
        
        return {
          ...vehicle.toObject(),
          totalRevenue,
          totalExpenses,
          profit: totalRevenue - totalExpenses,
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: vehiclesWithStats.length,
      data: vehiclesWithStats,
    });

  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicles.",
      error: err.message,
    });
  }
});






// 📌 Get single vehicle by ID
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Calculate totalRevenue, totalExpenses, and profit
    const Expense = (await import("../models/Expense.js")).default;
    const Revenue = (await import("../models/Revenue.js")).default;
    
    const expenses = await Expense.aggregate([
      { $match: { vehicleId: vehicle._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenues = await Revenue.aggregate([
      { $match: { vehicleId: vehicle._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const totalExpenses = expenses[0]?.total || 0;
    const totalRevenue = revenues[0]?.total || 0;

    res.json({
      success: true,
      data: {
        ...vehicle.toObject(),
        totalRevenue,
        totalExpenses,
        profit: totalRevenue - totalExpenses,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
      error: err.message,
    });
  }
});


// ✏️ Update vehicle
router.put("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully.",
      data: vehicle,
    });

  } catch (err) {
    console.error("Error updating vehicle:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle.",
      error: err.message,
    });
  }
});

// 🗑️ Delete vehicle
router.delete("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully.",
    });

  } catch (err) {
    console.error("Error deleting vehicle:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle.",
      error: err.message,
    });
  }
});

export default router;
