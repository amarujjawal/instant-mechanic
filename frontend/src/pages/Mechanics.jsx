import React, { useEffect, useState } from "react";
import { Search, MapPinned, Star, Briefcase, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import MapView from "../components/MapView";
export default function Mechanics({ mapOnly = false }) {
  const [rows, setRows] = useState([]),
    [q, setQ] = useState(""),
    [status, setStatus] = useState("all"),
    [loading, setLoading] = useState(true);
  const nav = useNavigate();
  async function load() {
    setLoading(true);
    try {
      setRows(
        (await api.get("/mechanics", { params: { search: q, status } })).data,
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [q, status]);
  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">FIELD TEAM</span>
          <h1>{mapOnly ? "Live mechanic map" : "Mechanics"}</h1>
          <p>
            {mapOnly
              ? "Monitor active field locations in real time."
              : "Track availability, workload and current assignments."}
          </p>
        </div>
        {!mapOnly && (
          <button className="secondary" onClick={() => nav("/live-map")}>
            <MapPinned size={17} /> Open live map
          </button>
        )}
      </div>
      {mapOnly ? (
        <div className="panel map-panel">
          <MapView mechanics={rows} />
        </div>
      ) : (
        <>
          <div className="panel">
            <div className="filters">
              <div className="search">
                <Search size={18} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search mechanic..."
                />
              </div>
              <select
                className="filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option>Available</option>
                <option>On Job</option>
                <option>Off Duty</option>
              </select>
            </div>
            {loading ? (
              <Loading />
            ) : (
              <div className="mechanic-grid">
                {rows.map((m) => (
                  <button
                    className="mechanic-card"
                    key={m._id}
                    onClick={() => nav(`/mechanics/${m._id}`)}
                  >
                    <div className="mechanic-top">
                      <div className="avatar large">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <StatusBadge status={m.status} />
                    </div>
                    <h3>{m.name}</h3>
                    <p>{m.specialty}</p>
                    <div className="mechanic-meta">
                      <span>
                        <Briefcase size={15} />
                        {m.jobsCompleted} jobs
                      </span>
                      <span>
                        <Star size={15} />
                        {m.rating}
                      </span>
                    </div>
                    <div className="current-job">
                      {m.currentBooking ? (
                        <>
                          <b>{m.currentBooking.bookingId}</b>
                          <span>
                            {m.currentBooking.service} ·{" "}
                            {m.currentBooking.customer?.name || "Customer"}
                          </span>
                        </>
                      ) : (
                        <span>Ready for next assignment</span>
                      )}
                      <ChevronRight size={17} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
