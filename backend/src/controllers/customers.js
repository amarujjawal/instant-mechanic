import Customer from "../models/Customer.js";
import Booking from "../models/Booking.js";
export async function listCustomers(req, res) {
  const customers = await Customer.find().sort({ createdAt: -1 }).lean();
  const ids = customers.map((c) => c._id);
  const counts = await Booking.aggregate([
    { $match: { customer: { $in: ids } } },
    {
      $group: {
        _id: "$customer",
        bookings: { $sum: 1 },
        spent: { $sum: "$amount" },
      },
    },
  ]);
  const map = new Map(counts.map((x) => [String(x._id), x]));
  res.json(
    customers.map((c) => ({
      ...c,
      bookings: map.get(String(c._id))?.bookings || 0,
      spent: map.get(String(c._id))?.spent || 0,
    })),
  );
}
