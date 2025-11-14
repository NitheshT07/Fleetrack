import Vehicle from "../models/Vehicle.js";

export const addVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });

  } catch (err) {
    console.error("Add Vehicle Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error adding vehicle",
      error: err.message,
    });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, vehicles });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
