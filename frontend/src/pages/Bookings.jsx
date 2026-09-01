import React, { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import { money, dateTime } from "../lib/format";
const statuses = [
  "all",
  "Pending",
  "Assigned",
  "Mechanic On The Way",
  "In Progress",
  "Completed",
  "Cancelled",
];
const categories = [
  "all",
  "Maintenance",
  "Safety",
  "Electrical",
  "Comfort",
  "Tyres",
  "Diagnostics",
  "Cleaning",
];
export default function Bookings() {
  const [rows, setRows] = useState([]),
    [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 }),
    [loading, setLoading] = useState(true),
    [q, setQ] = useState(""),
    [status, setStatus] = useState("all"),
    [category, setCategory] = useState("all"),
    [sort, setSort] = useState("scheduledAt"),
    [order, setOrder] = useState("desc");
  const nav = useNavigate();
  async function load() {
    setLoading(true);
    try {
      const r = await api.get("/bookings", {
        params: {
          search: q,
          status,
          category,
          sort,
          order,
          page: meta.page,
          limit: 10,
        },
      });
      setRows(r.data.items);
      setMeta((x) => ({
        ...x,
        page: r.data.page,
        pages: r.data.pages,
        total: r.data.total,
      }));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [q, status, category, sort, order, meta.page]);
  function download() {
    const a = document.createElement("a");
    a.href = `${api.defaults.baseURL}/bookings/export`;
    a.setAttribute("download", "bookings.csv");
    const token = localStorage.getItem("im_token");
    fetch(a.href, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((b) => {
        a.href = URL.createObjectURL(b);
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      });
  }
  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">OPERATIONS</span>
          <h1>Bookings</h1>
          <p>Search, filter and manage every service request.</p>
        </div>
        <button className="primary" onClick={download}>
          <Download size={17} /> Export CSV
        </button>
      </div>
      <div className="panel">
        <div className="filters">
          <div className="search">
            <Search size={18} />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setMeta((m) => ({ ...m, page: 1 }));
              }}
              placeholder="Search booking, plate or service..."
            />
          </div>
          <div className="filter-select">
            <SlidersHorizontal size={16} />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setMeta((m) => ({ ...m, page: 1 }));
              }}
            >
              {statuses.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <select
            className="filter-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setMeta((m) => ({ ...m, page: 1 }));
            }}
          >
            {categories.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <Loading text="Fetching bookings..." />
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      Booking{" "}
                      <button
                        className="sort"
                        onClick={() => {
                          setSort("bookingId");
                          setOrder(order === "asc" ? "desc" : "asc");
                        }}
                      >
                        <ArrowUpDown size={13} />
                      </button>
                    </th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Service</th>
                    <th>Mechanic</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Date / time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <b className="mono">{b.bookingId}</b>
                      </td>
                      <td>
                        <div className="person">
                          <div className="tiny-avatar">
                            {b.customer?.name?.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{b.customer?.name}</span>
                        </div>
                      </td>
                      <td>
                        {b.vehicle?.make} {b.vehicle?.model}
                        <small>{b.vehicle?.plate}</small>
                      </td>
                      <td>
                        {b.service}
                        <small>{b.category}</small>
                      </td>
                      <td>{b.mechanic?.name || "Unassigned"}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        <b>{money(b.amount)}</b>
                      </td>
                      <td>{dateTime(b.scheduledAt)}</td>
                      <td>
                        <button
                          className="icon-btn"
                          onClick={() => nav(`/bookings/${b._id}`)}
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                Showing <b>{rows.length}</b> of <b>{meta.total}</b>
              </span>
              <div>
                <button
                  className="icon-btn"
                  disabled={meta.page <= 1}
                  onClick={() => setMeta((m) => ({ ...m, page: m.page - 1 }))}
                >
                  <ChevronLeft size={17} />
                </button>
                <span>
                  Page {meta.page} of {Math.max(1, meta.pages)}
                </span>
                <button
                  className="icon-btn"
                  disabled={meta.page >= meta.pages}
                  onClick={() => setMeta((m) => ({ ...m, page: m.page + 1 }))}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
