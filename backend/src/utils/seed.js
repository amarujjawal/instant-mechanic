import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8"]);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Mechanic from "../models/Mechanic.js";
import Booking from "../models/Booking.js";
const first = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Arjun",
  "Kabir",
  "Rohan",
  "Ishaan",
  "Vihaan",
  "Anaya",
  "Diya",
  "Myra",
  "Sara",
  "Aanya",
  "Meera",
  "Kiara",
];
const last = [
  "Sharma",
  "Verma",
  "Patel",
  "Singh",
  "Gupta",
  "Khan",
  "Nair",
  "Joshi",
  "Mishra",
  "Rao",
];
const services = [
  ["Oil Change", "Maintenance"],
  ["Brake Inspection", "Safety"],
  ["Battery Replacement", "Electrical"],
  ["AC Service", "Comfort"],
  ["Full Service", "Maintenance"],
  ["Tyre Replacement", "Tyres"],
  ["Engine Diagnostics", "Diagnostics"],
  ["Car Wash", "Cleaning"],
];
const makes = [
  ["Maruti", "Swift"],
  ["Hyundai", "Creta"],
  ["Tata", "Nexon"],
  ["Honda", "City"],
  ["Toyota", "Innova"],
  ["Mahindra", "XUV700"],
];
const statuses = [
  "Pending",
  "Assigned",
  "Mechanic On The Way",
  "In Progress",
  "Completed",
  "Cancelled",
];
function pick(a) {
  return a[Math.floor(Math.random() * a.length)];
}
function dateBetween(days) {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * (days * 2 + 1)) - days);
  d.setHours(
    8 + Math.floor(Math.random() * 11),
    [0, 15, 30, 45][Math.floor(Math.random() * 4)],
    0,
    0,
  );
  return d;
}
await connectDB();
const pw = await bcrypt.hash("Admin@123", 10);
await User.create([
  {
    name: "Operations Admin",
    email: "admin@instantmechanic.demo",
    password: pw,
    role: "admin",
  },
  {
    name: "Operations User",
    email: "ops@instantmechanic.demo",
    password: pw,
    role: "operations",
  },
]);
const customers = await Customer.insertMany(
  Array.from({ length: 75 }, (_, i) => ({
    name: `${pick(first)} ${pick(last)}`,
    email: `customer${i + 1}@demo.com`,
    phone: `+91 9${String(100000000 + i).slice(0, 9)}`,
  })),
);
const mechanics = await Mechanic.insertMany(
  Array.from({ length: 24 }, (_, i) => ({
    name: `${pick(first)} ${pick(last)}`,
    phone: `+91 98${String(10000000 + i).slice(0, 8)}`,
    status: pick(["Available", "Available", "On Job", "Off Duty"]),
    jobsCompleted: Math.floor(Math.random() * 180),
    rating: Number((4.4 + Math.random() * 0.6).toFixed(1)),
    specialty: pick([
      "General Repair",
      "Electrical",
      "Diagnostics",
      "AC & Cooling",
      "Tyres",
    ]),
    location: {
      lat: 23.2 + (Math.random() - 0.5) * 0.12,
      lng: 77.43 + (Math.random() - 0.5) * 0.12,
    },
  })),
);
const bookings = Array.from({ length: 650 }, (_, i) => {
  const [service, category] = pick(services),
    [make, model] = pick(makes),
    status = pick(statuses);
  return {
    bookingId: `IM-${String(i + 1).padStart(5, "0")}`,
    customer: pick(customers)._id,
    vehicle: {
      make,
      model,
      year: 2017 + Math.floor(Math.random() * 9),
      plate: `MP ${String(4 + Math.floor(Math.random() * 20)).padStart(2, "0")} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${String(1000 + Math.floor(Math.random() * 9000))}`,
    },
    service,
    category,
    mechanic: ["Pending", "Cancelled"].includes(status)
      ? null
      : pick(mechanics)._id,
    status,
    amount: 500 + Math.floor(Math.random() * 5500),
    scheduledAt: dateBetween(30),
  };
});
await Booking.insertMany(bookings);
console.log("Seed complete: 650 bookings, 75 customers, 24 mechanics.");
await mongoose.disconnect();
