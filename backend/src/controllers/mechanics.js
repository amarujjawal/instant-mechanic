import Mechanic from "../models/Mechanic.js";
export async function listMechanics(req, res) {
  const { status, search = "" } = req.query;
  const f = {
    ...(status && status !== "all" ? { status } : {}),
    ...(search ? { name: new RegExp(search, "i") } : {}),
  };
  res.json(
    await Mechanic.find(f)
      .populate(
        "currentBooking",
        "bookingId service status scheduledAt customer",
      )
      .populate({
        path: "currentBooking",
        populate: { path: "customer", select: "name" },
      })
      .sort({ status: 1, name: 1 })
      .lean(),
  );
}
export async function getMechanic(req, res) {
  const m = await Mechanic.findById(req.params.id).populate({
    path: "currentBooking",
    populate: { path: "customer", select: "name" },
  });
  if (!m) return res.status(404).json({ message: "Mechanic not found" });
  res.json(m);
}
