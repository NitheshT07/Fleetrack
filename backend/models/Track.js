import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, default: "active" },
  timestamp: { type: Date, default: Date.now }
});

const Track = mongoose.model("Track", trackSchema);
export default Track;
