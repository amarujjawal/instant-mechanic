import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, ArrowRight } from "lucide-react";
import api from "../lib/api";
export default function Login() {
  const [email, setEmail] = useState("admin@instantmechanic.demo"),
    [password, setPassword] = useState("Admin@123"),
    [show, setShow] = useState(false),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await api.post("/auth/login", { email, password });
      localStorage.setItem("im_token", r.data.token);
      localStorage.setItem("im_user", JSON.stringify(r.data.user));
      nav("/");
    } catch (e) {
      setError(e.response?.data?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="visual-inner">
          <div className="brand">
            <div className="brand-mark">IM</div>
            <div>
              <b>Instant Mechanic</b>
              <span>Operations Platform</span>
            </div>
          </div>
          <div className="visual-copy">
            <span className="eyebrow">LIVE OPERATIONS</span>
            <h1>
              Keep every service
              <br />
              <span>moving forward.</span>
            </h1>
            <p>
              Monitor bookings, mechanics, customers and revenue from one calm,
              focused workspace.
            </p>
          </div>
          <div className="mini-dashboard">
            <div>
              <b>1,248</b>
              <span>Bookings</span>
            </div>
            <div>
              <b>₹18.6L</b>
              <span>Revenue</span>
            </div>
            <div>
              <b>18</b>
              <span>Active mechanics</span>
            </div>
          </div>
        </div>
      </div>
      <div className="login-panel">
        <div className="login-box">
          <div className="mobile-brand">
            <div className="brand-mark">IM</div>
          </div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to Operations</h2>
          <p>Use your operations account to continue.</p>
          <form onSubmit={submit}>
            <label>
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </label>
            <label>
              Password
              <div className="password">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  required
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && <div className="error-box">{error}</div>}
            <button className="primary full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight size={18} />
            </button>
          </form>
          <div className="demo">
            <ShieldCheck size={16} />
            <span>Demo: admin@instantmechanic.demo / Admin@123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
