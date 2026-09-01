import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Wrench,
  Users,
  MapPinned,
  Sun,
  Moon,
  LogOut,
  Bell,
  Menu,
  X,
  Download,
  Activity,
} from "lucide-react";
import { io } from "socket.io-client";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Bookings from "./pages/Bookings";
import Mechanics from "./pages/Mechanics";
import Customers from "./pages/Customers";
import BookingDetail from "./pages/BookingDetail";
import MechanicDetail from "./pages/MechanicDetail";
import api from "./lib/api";
const links = [
  ["/", "Overview", LayoutDashboard],
  ["/bookings", "Bookings", CalendarDays],
  ["/mechanics", "Mechanics", Wrench],
  ["/customers", "Customers", Users],
  ["/live-map", "Live Map", MapPinned],
];
function Shell({ children }) {
  const nav = useNavigate(),
    loc = useLocation(),
    [open, setOpen] = useState(false),
    [dark, setDark] = useState(localStorage.getItem("im_theme") === "dark"),
    [live, setLive] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("im_theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    s.on("connect", () => setLive(true));
    s.on("disconnect", () => setLive(false));
    return () => s.close();
  }, []);
  const logout = () => {
    localStorage.removeItem("im_token");
    nav("/login");
  };
  return (
    <div className="app">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark">IM</div>
          <div>
            <b>Instant Mechanic</b>
            <span>Operations</span>
          </div>
          <button
            className="icon-btn mobile-close"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav>
          {links.map(([to, label, Icon]) => (
            <button
              key={to}
              className={loc.pathname === to ? "nav-item active" : "nav-item"}
              onClick={() => {
                nav(to);
                setOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="live-pill">
            <i className={live ? "dot live" : "dot"} />
            {live ? "Live updates" : "Offline"}
          </div>
          <button className="nav-item" onClick={logout}>
            <LogOut size={19} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <div className="crumb">
            <Activity size={18} />
            <span>Operations Center</span>
            <em>•</em>
            <b>{links.find((x) => x[0] === loc.pathname)?.[1] || "Details"}</b>
          </div>
          <div className="top-actions">
            <button className="icon-btn">
              <Bell size={19} />
              <span className="notif" />
            </button>
            <button className="icon-btn" onClick={() => setDark(!dark)}>
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <div className="avatar">OA</div>
          </div>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
function Protected({ children }) {
  return localStorage.getItem("im_token") ? (
    <Shell>{children}</Shell>
  ) : (
    <Navigate to="/login" replace />
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Overview />
          </Protected>
        }
      />
      <Route
        path="/bookings"
        element={
          <Protected>
            <Bookings />
          </Protected>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <Protected>
            <BookingDetail />
          </Protected>
        }
      />
      <Route
        path="/mechanics"
        element={
          <Protected>
            <Mechanics />
          </Protected>
        }
      />
      <Route
        path="/mechanics/:id"
        element={
          <Protected>
            <MechanicDetail />
          </Protected>
        }
      />
      <Route
        path="/customers"
        element={
          <Protected>
            <Customers />
          </Protected>
        }
      />
      <Route
        path="/live-map"
        element={
          <Protected>
            <Mechanics mapOnly />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
