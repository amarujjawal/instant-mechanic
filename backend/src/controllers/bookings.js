import Booking from "../models/Booking.js";
import Mechanic from "../models/Mechanic.js";
export async function listBookings(req, res) {
  const {
    search = "",
    status,
    category,
    from,
    to,
    sort = "scheduledAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = req.query;
  const filter = {};
  if (status && status !== "all") filter.status = status;
  if (category && category !== "all") filter.category = category;
  if (from || to)
    filter.scheduledAt = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to ? { $lte: new Date(to) } : {}),
    };
  if (search) {
    filter.$or = [
      { bookingId: new RegExp(search, "i") },
      { service: new RegExp(search, "i") },
      { "vehicle.plate": new RegExp(search, "i") },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const sortObj = { [sort]: order === "asc" ? 1 : -1 };
  const [items, total] = await Promise.all([
    Booking.find(filter)
      .populate("customer", "name email phone")
      .populate("mechanic", "name status")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Booking.countDocuments(filter),
  ]);
  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
}
export async function getBooking(req, res) {
  const item = await Booking.findById(req.params.id)
    .populate("customer")
    .populate("mechanic");
  if (!item) return res.status(404).json({ message: "Booking not found" });
  res.json(item);
}
export async function updateBooking(req, res) {
  const item = await Booking.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Booking not found" });
  const old = item.status;
  Object.assign(item, req.body);
  await item.save();
  if (item.mechanic && item.status === "Completed") {
    await Mechanic.findByIdAndUpdate(item.mechanic, {
      $inc: { jobsCompleted: 1 },
      $set: { status: "Available", currentBooking: null },
    });
  } else if (
    item.mechanic &&
    ["Assigned", "Mechanic On The Way", "In Progress"].includes(item.status)
  ) {
    await Mechanic.findByIdAndUpdate(item.mechanic, {
      $set: { status: "On Job", currentBooking: item._id },
    });
  }
  req.app
    .get("io")
    ?.emit("booking:updated", {
      bookingId: item._id,
      status: item.status,
      oldStatus: old,
    });
  res.json(
    await Booking.findById(item._id)
      .populate("customer", "name email")
      .populate("mechanic", "name status"),
  );
}
