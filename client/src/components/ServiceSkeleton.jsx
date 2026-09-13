import "./serviceSkeleton.css";

export default function ServiceSkeleton() {
  return (
    <div className="sk-card">

      {/* image placeholder */}
      <div className="sk-image">
        <div className="sk-shimmer" />
      </div>

      {/* content placeholder */}
      <div className="sk-body">

        {/* top row: title + rating pill */}
        <div className="sk-row">
          <div className="sk-line sk-line--title" />
          <div className="sk-pill" />
        </div>

        {/* price */}
        <div className="sk-line sk-line--price" />

        {/* two action buttons */}
        <div className="sk-actions">
          <div className="sk-btn sk-btn--primary" />
          <div className="sk-btn sk-btn--outline" />
        </div>

      </div>

    </div>
  );
}