import Booking from "../models/Booking.js";
import Mechanic from "../models/Mechanic.js";
import Customer from "../models/Customer.js";
export async function dashboard(req, res) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const [
    total,
    today,
    completed,
    pending,
    cancelled,
    revenue,
    activeMechanics,
    newCustomers,
    statusAgg,
    categoryAgg,
    bookingsSeries,
    revenueSeries,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ scheduledAt: { $gte: start, $lt: end } }),
    Booking.countDocuments({ status: "Completed" }),
    Booking.countDocuments({ status: "Pending" }),
    Booking.countDocuments({ status: "Cancelled" }),
    Booking.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Mechanic.countDocuments({ status: { $in: ["Available", "On Job"] } }),
    Customer.countDocuments({ createdAt: { $gte: start, $lt: end } }),
    Booking.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]),
    Booking.aggregate([
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]),
    Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$scheduledAt" } },
          value: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),
    Booking.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$scheduledAt" } },
          value: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),
  ]);
  res.json({
    stats: {
      totalBookings: total,
      todayBookings: today,
      completedBookings: completed,
      pendingBookings: pending,
      cancelledBookings: cancelled,
      totalRevenue: revenue[0]?.total || 0,
      activeMechanics,
      newCustomers,
    },
    analytics: {
      status: statusAgg.map((x) => ({ name: x._id, value: x.value })),
      categories: categoryAgg.map((x) => ({ name: x._id, value: x.value })),
      bookingsOverTime: bookingsSeries.map((x) => ({
        date: x._id,
        value: x.value,
      })),
      revenueOverTime: revenueSeries.map((x) => ({
        date: x._id,
        value: x.value,
      })),
    },
  });
}
