import { useState } from "react";
import "./CommentSection.css";

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });

  // ── BACKEND LOGIC UNTOUCHED ──────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    const newComment = {
      id: Date.now(),
      ...form,
      time: new Date().toLocaleString(),
    };
    setComments([newComment, ...comments]);
    setForm({ name: "", message: "" });
  };
  // ─────────────────────────────────────────────────────────────────

  return (
    <section className="cs-section">
      {/* ── ambient blobs ── */}
      <div className="cs-blob cs-blob--a" />
      <div className="cs-blob cs-blob--b" />

      <div className="cs-wrapper">

        {/* ── heading ── */}
        <header className="cs-header">
          <span className="cs-eyebrow">Discussion</span>
          <h2 className="cs-title">Leave a Comment</h2>
          <p className="cs-subtitle">
            Share your thoughts — we read every one.
          </p>
        </header>

        {/* ── form ── */}
        <form className="cs-form" onSubmit={handleSubmit}>
          <div className="cs-field">
            <label className="cs-label" htmlFor="cs-name">Name</label>
            <input
              id="cs-name"
              className="cs-input"
              type="text"
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="cs-field">
            <label className="cs-label" htmlFor="cs-message">Message</label>
            <textarea
              id="cs-message"
              className="cs-textarea"
              placeholder="Write something thoughtful…"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <button className="cs-btn" type="submit">
            <span>Post Comment</span>
            <svg className="cs-btn-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        {/* ── divider ── */}
        <div className="cs-divider">
          <span>{comments.length} comment{comments.length !== 1 ? "s" : ""}</span>
        </div>

        {/* ── list ── */}
        <div className="cs-list">
          {comments.length === 0 && (
            <div className="cs-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p>No comments yet. Be the first!</p>
            </div>
          )}

          {comments.map((c, i) => (
            <div
              key={c.id}
              className="cs-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="cs-card-avatar">
                {c.name.charAt(0).toUpperCase()}
              </div>

              <div className="cs-card-body">
                <div className="cs-card-meta">
                  <strong className="cs-card-name">{c.name}</strong>
                  <span className="cs-card-time">{c.time}</span>
                </div>
                <p className="cs-card-text">{c.message}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}