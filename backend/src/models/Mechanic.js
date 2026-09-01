import mongoose from "mongoose";
const mechanicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    status: {
      type: String,
      enum: ["Available", "On Job", "Off Duty"],
      default: "Available",
    },
    jobsCompleted: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    specialty: String,
    location: { lat: Number, lng: Number },
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Mechanic", mechanicSchema);
