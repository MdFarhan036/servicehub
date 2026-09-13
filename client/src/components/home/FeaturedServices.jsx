import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import API from "../../services/api";
import "./FeaturedServices.css";

export default function FeaturedServices() {
  // ── BACKEND LOGIC UNTOUCHED ──────────────────────────────────────
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await API.get("/services");
      setServices(res.data.slice(0, 3));
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);
  // ─────────────────────────────────────────────────────────────────

  return (
    <section className="fs-section">
      {/* blobs */}
      <div className="fs-blob fs-blob--a" />
      <div className="fs-blob fs-blob--b" />

      <div className="fs-wrapper">

        {/* header */}
        <header className="fs-header">
          <span className="fs-eyebrow">What We Offer</span>
          <h2 className="fs-title">Featured Services</h2>
          <p className="fs-subtitle">Hand-picked services crafted for your everyday needs.</p>
        </header>

        {/* skeleton */}
        {loading && (
          <div className="fs-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="fs-skeleton">
                <div className="fs-skeleton-img" />
                <div className="fs-skeleton-body">
                  <div className="fs-skeleton-line fs-skeleton-line--title" />
                  <div className="fs-skeleton-line fs-skeleton-line--price" />
                  <div className="fs-skeleton-line fs-skeleton-line--btn" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* cards */}
        {!loading && (
          <div className="fs-grid">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                className="fs-card"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* image */}
                <div className="fs-card-img-wrap">
                  <img
                    src={s.image || "/images/default.jpg"}
                    alt={s.title}
                    className="fs-card-img"
                  />
                  <div className="fs-card-img-overlay" />
                  <span className="fs-card-badge">Popular</span>
                </div>

                {/* body */}
                <div className="fs-card-body">
                  <h3 className="fs-card-title">{s.title}</h3>

                  <div className="fs-card-footer">
                    <span className="fs-card-price">₹{s.price}</span>
                    <Link to="/services" className="fs-card-btn">
                      Book Now
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* view all */}
        {!loading && services.length > 0 && (
          <div className="fs-cta">
            <Link to="/services" className="fs-view-all">
              View All Services
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}