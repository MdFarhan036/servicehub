import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./login.css";

export default function Login() {
  // ── BACKEND LOGIC UNTOUCHED ──────────────────────────────────────
  const { setUser }     = useAuth();
  const navigate        = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      setUser(res.data.user);
      alert("Login successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────

  return (
    <div className="lg-page">

      {/* left decorative panel */}
      <div className="lg-panel" aria-hidden="true">
        <div className="lg-panel-blob lg-panel-blob--a" />
        <div className="lg-panel-blob lg-panel-blob--b" />
        <div className="lg-panel-content">
          <div className="lg-panel-logo">
            <span className="lg-panel-logo-icon">S</span>
            ServiceHub
          </div>
          <h2 className="lg-panel-title">
            Your home,<br />perfectly served.
          </h2>
          <p className="lg-panel-sub">
            Verified professionals, transparent pricing, and instant booking — all in one place.
          </p>
          <div className="lg-panel-badges">
            {["10k+ Customers", "500+ Pros", "4.9★ Rating"].map((b) => (
              <span key={b} className="lg-panel-badge">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* right form panel */}
      <div className="lg-form-side">
        <form className="lg-box" onSubmit={handleSubmit} noValidate>

          {/* header */}
          <div className="lg-box-header">
            <Link to="/" className="lg-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to home
            </Link>
            <h2 className="lg-title">Welcome back</h2>
            <p className="lg-subtitle">Sign in to continue booking services</p>
          </div>

          {/* error */}
          {error && (
            <div className="lg-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* email */}
          <div className="lg-field">
            <label className="lg-label" htmlFor="lg-email">Email address</label>
            <div className="lg-input-wrap">
              <svg className="lg-input-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="lg-email"
                type="email"
                placeholder="you@example.com"
                className="lg-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* password */}
          <div className="lg-field">
            <label className="lg-label" htmlFor="lg-password">Password</label>
            <div className="lg-input-wrap">
              <svg className="lg-input-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="lg-password"
                type="password"
                placeholder="Enter your password"
                className="lg-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* submit */}
          <button className="lg-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="lg-spinner" />
                Signing in…
              </>
            ) : (
              <>
                Sign In
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>

         

        </form>
      </div>

    </div>
  );
}