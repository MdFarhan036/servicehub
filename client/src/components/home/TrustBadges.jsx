import { useEffect, useState } from "react";
import API from "../../services/api";
import "./TrustBadges.css";

export default function TrustBadges() {
  // ── BACKEND LOGIC UNTOUCHED ──────────────────────────────────────
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHighlights = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/highlights");
      setHighlights(res.data);
    } catch (err) {
      console.error("Error fetching highlights", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHighlights();
  }, []);
  // ─────────────────────────────────────────────────────────────────

  const icons = ["🏆", "👥", "⭐", "🛡️"];

  return (
    <section className="tb-section">
      <div className="tb-blob tb-blob--a" />
      <div className="tb-blob tb-blob--b" />

      {/* top wave divider */}
      <div className="tb-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#f5f7ff" />
        </svg>
      </div>

      <div className="tb-wrapper">

        {/* header */}
        <header className="tb-header">
          <span className="tb-eyebrow">By the Numbers</span>
          <h2 className="tb-title">Our Achievements</h2>
          <p className="tb-subtitle">Numbers that speak louder than words.</p>
        </header>

        {/* skeleton */}
        {loading && (
          <div className="tb-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="tb-skeleton">
                <div className="tb-sk-icon" />
                <div className="tb-sk-line tb-sk-line--num" />
                <div className="tb-sk-line tb-sk-line--label" />
              </div>
            ))}
          </div>
        )}

        {/* stat cards */}
        {!loading && (
          <div className="tb-grid">
            {highlights.map((h, i) => (
              <div
                key={h.id}
                className="tb-card"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {/* icon */}
                <div className="tb-icon-wrap">
                  <span className="tb-icon">{icons[i % icons.length]}</span>
                </div>

                {/* number */}
                <span className="tb-number">{h.number}</span>

                {/* label */}
                <p className="tb-label">{h.label}</p>

                {/* bottom accent bar */}
                <div className="tb-bar" />
              </div>
            ))}
          </div>
        )}

      </div>

      {/* bottom wave divider */}
      <div className="tb-wave tb-wave--bottom" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z" fill="#f5f7ff" />
        </svg>
      </div>
    </section>
  );
}