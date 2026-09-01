import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true, index: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    vehicle: { make: String, model: String, year: Number, plate: String },
    service: { type: String, required: true },
    category: { type: String, required: true },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Mechanic On The Way",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },
    amount: { type: Number, required: true },
    scheduledAt: { type: Date, required: true, index: true },
    notes: String,
  },
  { timestamps: true },
);
export default mongoose.model("Booking", bookingSchema);
