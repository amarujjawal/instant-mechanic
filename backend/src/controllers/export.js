import Booking from "../models/Booking.js";
export async function exportBookings(req, res) {
  const rows = await Booking.find()
    .populate("customer", "name")
    .populate("mechanic", "name")
    .sort({ scheduledAt: -1 })
    .lean();
  const head =
    "Booking ID,Customer,Vehicle,Service,Mechanic,Status,Amount,Date/Time";
  const body = rows
    .map((b) =>
      [
        b.bookingId,
        b.customer?.name,
        b.vehicle?.plate,
        `${b.vehicle?.make || ""} ${b.vehicle?.model || ""}`,
        b.mechanic?.name || "",
        b.status,
        b.amount,
        new Date(b.scheduledAt).toISOString(),
      ]
        .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=bookings.csv");
  res.send(head + "\n" + body);
}
