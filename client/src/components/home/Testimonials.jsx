import { useEffect, useState } from "react";
import API from "../../services/api";
import "./Testimonials.css";

export default function Testimonials() {
  // ── BACKEND LOGIC UNTOUCHED ──────────────────────────────────────
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/testimonials");
      setTestimonials(res.data.slice(0, 3));
    } catch (err) {
      console.error("Error fetching testimonials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);
  // ─────────────────────────────────────────────────────────────────

  return (
    <section className="tm-section">
      <div className="tm-blob tm-blob--a" />
      <div className="tm-blob tm-blob--b" />

      <div className="tm-wrapper">

        {/* header */}
        <header className="tm-header">
          <span className="tm-eyebrow">Customer Stories</span>
          <h2 className="tm-title">What Our Customers Say</h2>
          <p className="tm-subtitle">Real reviews from real homeowners across the city.</p>
        </header>

        {/* skeleton */}
        {loading && (
          <div className="tm-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="tm-skeleton">
                <div className="tm-skeleton-line tm-skeleton-line--stars" />
                <div className="tm-skeleton-line tm-skeleton-line--text" />
                <div className="tm-skeleton-line tm-skeleton-line--text2" />
                <div className="tm-skeleton-footer">
                  <div className="tm-skeleton-avatar" />
                  <div className="tm-skeleton-line tm-skeleton-line--name" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* cards */}
        {!loading && (
          <div className="tm-grid">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="tm-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* quote mark */}
                <div className="tm-quote-mark" aria-hidden="true">"</div>

                {/* stars */}
                <div className="tm-stars" aria-label="5 stars">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} className="tm-star" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* review text */}
                <p className="tm-review">"{t.review}"</p>

                {/* author */}
                <div className="tm-author">
                  <div className="tm-avatar">
                    {t.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="tm-author-info">
                    <strong className="tm-name">{t.name}</strong>
                    <span className="tm-tag">Verified Customer</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}