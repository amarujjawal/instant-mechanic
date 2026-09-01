import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  UserRound,
  Car,
  IndianRupee,
  Save,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import { money, dateTime } from "../lib/format";
const statuses = [
  "Pending",
  "Assigned",
  "Mechanic On The Way",
  "In Progress",
  "Completed",
  "Cancelled",
];
export default function BookingDetail() {
  const { id } = useParams(),
    nav = useNavigate(),
    [b, setB] = useState(null),
    [status, setStatus] = useState(""),
    [saving, setSaving] = useState(false);
  async function load() {
    const x = (await api.get(`/bookings/${id}`)).data;
    setB(x);
    setStatus(x.status);
  }
  useEffect(() => {
    load();
  }, [id]);
  if (!b) return <Loading />;
  async function save() {
    setSaving(true);
    try {
      const x = (await api.patch(`/bookings/${id}`, { status })).data;
      setB(x);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <button className="back" onClick={() => nav("/bookings")}>
        <ArrowLeft size={17} /> Back to bookings
      </button>
      <div className="page-head">
        <div>
          <span className="eyebrow">BOOKING DETAIL</span>
          <h1>{b.bookingId}</h1>
          <p>
            Service request created{" "}
            {new Date(b.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
        <StatusBadge status={b.status} />
      </div>
      <div className="detail-grid">
        <div className="panel">
          <h3>Service overview</h3>
          <div className="detail-list">
            <div>
              <Car />
              <span>Vehicle</span>
              <b>
                {b.vehicle.make} {b.vehicle.model} · {b.vehicle.plate}
              </b>
            </div>
            <div>
              <Clock3 />
              <span>Scheduled</span>
              <b>{dateTime(b.scheduledAt)}</b>
            </div>
            <div>
              <IndianRupee />
              <span>Amount</span>
              <b>{money(b.amount)}</b>
            </div>
            <div>
              <UserRound />
              <span>Mechanic</span>
              <b>{b.mechanic?.name || "Unassigned"}</b>
            </div>
          </div>
        </div>
        <div className="panel">
          <h3>Update status</h3>
          <p className="muted">
            Changes are broadcast live to connected dashboards.
          </p>
          <select
            className="full-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            className="primary full"
            disabled={saving || status === b.status}
            onClick={save}
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save status"}
          </button>
        </div>
        <div className="panel">
          <h3>Customer</h3>
          <div className="customer-mini">
            <div className="avatar large">
              {b.customer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <b>{b.customer.name}</b>
              <span>{b.customer.email}</span>
              <span>{b.customer.phone}</span>
            </div>
          </div>
        </div>
        <div className="panel">
          <h3>Service</h3>
          <div className="service-big">
            <span>{b.category}</span>
            <h2>{b.service}</h2>
            <p>{b.notes || "No additional service notes were provided."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
