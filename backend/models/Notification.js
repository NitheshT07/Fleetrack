import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["vehicle_added", "expense_added", "revenue_added", "system"],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed }, // Store additional data like vehicleId, expenseId, etc.
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);

