import { FiX } from "react-icons/fi";
import "./MediaPreview.css";

export default function MediaPreview({ media, onRemove }) {
  if (!media) return null;

  return (
    <div className="media-preview">
      {media.kind === "image" ? (
        <img src={media.url} alt={media.fileName} />
      ) : (
        <video src={media.url} muted />
      )}
      <span className="preview-name">{media.fileName}</span>
      <button className="preview-remove" onClick={onRemove}><FiX /></button>
    </div>
  );
}
