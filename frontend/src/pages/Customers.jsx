import React, { useEffect, useState } from "react";
import { Search, Mail, Phone, IndianRupee } from "lucide-react";
import api from "../lib/api";
import Loading from "../components/Loading";
import { money } from "../lib/format";
export default function Customers() {
  const [rows, setRows] = useState([]),
    [q, setQ] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/customers")
      .then((r) => setRows(r.data))
      .finally(() => setLoading(false));
  }, []);
  const filtered = rows.filter((c) =>
    `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">CUSTOMER SUCCESS</span>
          <h1>Customers</h1>
          <p>Understand customer activity and service history.</p>
        </div>
      </div>
      <div className="panel">
        <div className="filters">
          <div className="search">
            <Search size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search customer..."
            />
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="customer-grid">
            {filtered.map((c) => (
              <div className="customer-card" key={c._id}>
                <div className="customer-head">
                  <div className="avatar large">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3>{c.name}</h3>
                    <span>
                      Customer since{" "}
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="contact">
                  <span>
                    <Mail size={15} />
                    {c.email}
                  </span>
                  <span>
                    <Phone size={15} />
                    {c.phone}
                  </span>
                </div>
                <div className="customer-stats">
                  <div>
                    <b>{c.bookings}</b>
                    <span>Bookings</span>
                  </div>
                  <div>
                    <b>{money(c.spent)}</b>
                    <span>Lifetime value</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
