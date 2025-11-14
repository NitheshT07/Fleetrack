// // backend/models/Expense.js
// import mongoose from "mongoose";

// const expenseSchema = new mongoose.Schema({
//   vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: false },
//   category: { type: String, required: true }, // Fuel, Maintenance, Insurance etc.
//   amount: { type: Number, required: true },
//   supplier: String,
//   date: { type: Date, default: Date.now },
//   kmReading: { type: Number },
//   notes: String
// });

// export default mongoose.model("Expense", expenseSchema);


import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    supplier: { type: String },
    kmReading: { type: Number },
    notes: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
