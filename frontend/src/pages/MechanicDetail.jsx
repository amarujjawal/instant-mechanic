import React, { useEffect, useState } from "react";
import { ArrowLeft, Star, Briefcase, Phone, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
export default function MechanicDetail() {
  const { id } = useParams(),
    nav = useNavigate(),
    [m, setM] = useState(null);
  useEffect(() => {
    api.get(`/mechanics/${id}`).then((r) => setM(r.data));
  }, [id]);
  if (!m) return <Loading />;
  return (
    <div>
      <button className="back" onClick={() => nav("/mechanics")}>
        <ArrowLeft size={17} /> Back to mechanics
      </button>
      <div className="profile-hero">
        <div className="avatar xlarge">{m.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <span className="eyebrow">MECHANIC PROFILE</span>
          <h1>{m.name}</h1>
          <p>
            {m.specialty} · {m.phone}
          </p>
        </div>
        <StatusBadge status={m.status} />
      </div>
      <div className="detail-grid">
        <div className="panel">
          <h3>Performance</h3>
          <div className="perf-grid">
            <div>
              <Briefcase />
              <b>{m.jobsCompleted}</b>
              <span>Jobs completed</span>
            </div>
            <div>
              <Star />
              <b>{m.rating}</b>
              <span>Average rating</span>
            </div>
          </div>
        </div>
        <div className="panel">
          <h3>Contact</h3>
          <div className="detail-list">
            <div>
              <Phone />
              <span>Phone</span>
              <b>{m.phone}</b>
            </div>
            <div>
              <MapPin />
              <span>Service area</span>
              <b>Bhopal, MP</b>
            </div>
          </div>
        </div>
        <div className="panel wide-panel">
          <h3>Current / last booking</h3>
          {m.currentBooking ? (
            <div className="booking-highlight">
              <div>
                <b>{m.currentBooking.bookingId}</b>
                <span>{m.currentBooking.service}</span>
              </div>
              <StatusBadge status={m.currentBooking.status} />
            </div>
          ) : (
            <div className="empty">
              No active booking. Mechanic is ready for the next job.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
