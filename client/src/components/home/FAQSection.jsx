import { useState, useEffect } from "react";
import API from "../../services/api";
import "./FAQSection.css";

export default function FAQSection() {
  // ── BACKEND LOGIC UNTOUCHED ──────────────────────────────────────
  const [open, setOpen] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/faqs");
      setFaqs(res.data);
    } catch (err) {
      console.error("Error fetching FAQs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);
  // ─────────────────────────────────────────────────────────────────

  return (
    <section className="faq-section">
      {/* ambient blobs */}
      <div className="faq-blob faq-blob--a" />
      <div className="faq-blob faq-blob--b" />

      <div className="faq-wrapper">

        {/* header */}
        <header className="faq-header">
          <span className="faq-eyebrow">Got Questions?</span>
          <h2 className="faq-title">Frequently Asked<br />Questions</h2>
          <p className="faq-subtitle">Everything you need to know — answered clearly.</p>
        </header>

        {/* body */}
        <div className="faq-list">

          {loading && (
            <div className="faq-skeleton-wrap">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="faq-skeleton" />
              ))}
            </div>
          )}

          {!loading && faqs.length === 0 && (
            <div className="faq-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <circle cx="12" cy="17" r=".5" fill="currentColor" />
              </svg>
              <p>No FAQs available at the moment.</p>
            </div>
          )}

          {!loading && faqs.map((f, i) => (
            <div
              key={f.id}
              className={`faq-item ${open === i ? "faq-item--open" : ""}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="faq-q-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-q-text">{f.question}</span>
                <span className="faq-chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {/* always rendered for smooth CSS animation */}
              <div className="faq-a">
                <p>{f.answer}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}