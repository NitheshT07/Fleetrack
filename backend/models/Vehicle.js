// // backend/models/Vehicle.js
// import mongoose from "mongoose";

// const vehicleSchema = new mongoose.Schema({
//   registrationNo: { type: String, required: true, unique: true }, // TN-01-AB-1234
//   model: { type: String },
//   type: { type: String }, // Truck / Van
//   status: { type: String, default: "active" }, // active, maintenance, inactive
//   purchaseDate: Date,
//   insuranceExpiry: Date,
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("Vehicle", vehicleSchema);







import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  model: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  insuranceExpiry: { type: Date, required: true },
  status: { type: String, default: "Active", enum: ["Active", "Maintenance", "Inactive"] },
  documents: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
