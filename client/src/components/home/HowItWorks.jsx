import "./HowItWorks.css";

export default function HowItWorks() {
  // ── DATA UNTOUCHED ───────────────────────────────────────────────
  const steps = [
    { step: "1", title: "Choose Service", desc: "Select service" },
    { step: "2", title: "Book Schedule",  desc: "Pick time" },
    { step: "3", title: "Expert Visit",   desc: "Professional comes" },
    { step: "4", title: "Relax",          desc: "Enjoy service" },
  ];
  // ─────────────────────────────────────────────────────────────────

  const icons = ["🔍", "📅", "🛠️", "✨"];

  return (
    <section className="hiw-section">
      <div className="hiw-blob hiw-blob--a" />
      <div className="hiw-blob hiw-blob--b" />

      <div className="hiw-wrapper">

        {/* header */}
        <header className="hiw-header">
          <span className="hiw-eyebrow">Simple Process</span>
          <h2 className="hiw-title">How It Works</h2>
          <p className="hiw-subtitle">From booking to bliss — in four easy steps.</p>
        </header>

        {/* steps */}
        <div className="hiw-grid">
          {steps.map((s, i) => (
            <div key={i} className="hiw-card" style={{ animationDelay: `${i * 100}ms` }}>

              {/* connector line (hidden on last) */}
              {i < steps.length - 1 && (
                <div className="hiw-connector" aria-hidden="true">
                  <svg viewBox="0 0 60 12" fill="none">
                    <path d="M0 6 Q30 0 60 6" stroke="#c7d2fe" strokeWidth="2" strokeDasharray="4 3"/>
                  </svg>
                </div>
              )}

              {/* icon bubble */}
              <div className="hiw-icon-wrap">
                <span className="hiw-icon">{icons[i]}</span>
                <span className="hiw-step-num">{s.step}</span>
              </div>

              <h3 className="hiw-card-title">{s.title}</h3>
              <p  className="hiw-card-desc">{s.desc}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}