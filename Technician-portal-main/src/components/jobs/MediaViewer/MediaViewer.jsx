import { FiImage } from "react-icons/fi";
import "./MediaViewer.css";

export default function MediaViewer({ media = [] }) {
  if (!media.length) {
    return (
      <div className="media-empty">
        <FiImage />
        <p>No photos or videos uploaded for this job yet.</p>
      </div>
    );
  }

  return (
    <div className="media-grid">
      {media.map((m, i) => (
        <div className="media-item" key={i}>
          {m.kind === "video" ? <video src={m.url} controls /> : <img src={m.url} alt="" />}
        </div>
      ))}
    </div>
  );
}
