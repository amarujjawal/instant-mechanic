import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  XCircle,
  IndianRupee,
  Users,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../lib/api";
import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import { money, dateTime } from "../lib/format";
import { io } from "socket.io-client";
export default function Overview() {
  const [data, setData] = useState(null),
    [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      setData((await api.get("/dashboard")).data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    const s = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    s.on("booking:updated", load);
    return () => s.close();
  }, []);
  if (loading && !data) return <Loading />;
  const s = data?.stats || {};
  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">MONDAY, AUG 31 · LIVE</span>
          <h1>Good evening, Operations 👋</h1>
          <p>Here’s what’s happening across your service network.</p>
        </div>
        <button className="secondary" onClick={load}>
          <RefreshCw size={17} /> Refresh
        </button>
      </div>
      <div className="stats-grid">
        <StatCard
          label="Total bookings"
          value={s.totalBookings?.toLocaleString()}
          icon={CalendarCheck}
          meta="12.4%"
        />
        <StatCard
          label="Today's bookings"
          value={s.todayBookings}
          icon={Clock3}
          meta="8.2%"
        />
        <StatCard
          label="Completed bookings"
          value={s.completedBookings}
          icon={CheckCircle2}
          meta="6.1%"
        />
        <StatCard
          label="Pending bookings"
          value={s.pendingBookings}
          icon={Clock3}
          meta="3.8%"
          positive={false}
        />
        <StatCard
          label="Cancelled"
          value={s.cancelledBookings}
          icon={XCircle}
        />
        <StatCard
          label="Total revenue"
          value={money(s.totalRevenue)}
          icon={IndianRupee}
          meta="15.8%"
        />
        <StatCard
          label="Active mechanics"
          value={s.activeMechanics}
          icon={Users}
          meta="4.3%"
        />
        <StatCard
          label="New customers"
          value={s.newCustomers}
          icon={UserPlus}
          meta="9.2%"
        />
      </div>
      <div className="chart-grid">
        <div className="panel wide">
          <div className="panel-head">
            <div>
              <h3>Bookings over time</h3>
              <p>Daily booking volume</p>
            </div>
          </div>
          <div className="chart">
            <ResponsiveContainer>
              <AreaChart data={data.analytics.bookingsOverTime}>
                <defs>
                  <linearGradient id="bookingFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopOpacity={0.28} />
                    <stop offset="100%" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  strokeWidth={2.5}
                  fill="url(#bookingFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Booking status</h3>
              <p>Current distribution</p>
            </div>
          </div>
          <div className="chart donut">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.analytics.status}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={3}
                >
                  {data.analytics.status.map((x, i) => (
                    <Cell key={i} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={55} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel wide">
          <div className="panel-head">
            <div>
              <h3>Revenue over time</h3>
              <p>Completed booking revenue</p>
            </div>
          </div>
          <div className="chart">
            <ResponsiveContainer>
              <BarChart data={data.analytics.revenueOverTime}>
                <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} />
                <YAxis />
                <Tooltip formatter={(v) => money(v)} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Service categories</h3>
              <p>Demand mix</p>
            </div>
          </div>
          <div className="category-list">
            {data.analytics.categories.map((x) => (
              <div className="cat-row" key={x.name}>
                <span>{x.name}</span>
                <b>{x.value}</b>
                <div className="bar">
                  <i
                    style={{
                      width: `${Math.min(100, (x.value / Math.max(...data.analytics.categories.map((a) => a.value))) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="panel live-card">
        <div className="panel-head">
          <div>
            <h3>Live operations</h3>
            <p>Changes stream in automatically through WebSockets.</p>
          </div>
          <StatusBadge status="In Progress" />
        </div>
        <div className="live-message">
          <div className="pulse" />
          <div>
            <b>Real-time monitoring is active</b>
            <span>
              Update a booking status from the Bookings page to see this
              dashboard refresh instantly.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
