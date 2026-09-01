import { Router } from "express";
import { login, me } from "../controllers/auth.js";
import { dashboard } from "../controllers/dashboard.js";
import {
  listBookings,
  getBooking,
  updateBooking,
} from "../controllers/bookings.js";
import { listMechanics, getMechanic } from "../controllers/mechanics.js";
import { listCustomers } from "../controllers/customers.js";
import { exportBookings } from "../controllers/export.js";
import { auth, roles } from "../middleware/auth.js";
const r = Router();
r.post("/auth/login", login);
r.get("/auth/me", auth, me);
r.get("/dashboard", auth, dashboard);
r.get("/bookings", auth, listBookings);
r.get("/bookings/export", auth, exportBookings);
r.get("/bookings/:id", auth, getBooking);
r.patch("/bookings/:id", auth, roles("admin", "operations"), updateBooking);
r.get("/mechanics", auth, listMechanics);
r.get("/mechanics/:id", auth, getMechanic);
r.get("/customers", auth, listCustomers);
export default r;
