import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    tripId: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    startLocation: { type: String },
    endLocation: { type: String },
    distance: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Revenue", revenueSchema);
