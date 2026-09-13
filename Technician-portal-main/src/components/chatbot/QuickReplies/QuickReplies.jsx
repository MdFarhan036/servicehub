import "./QuickReplies.css";

export default function QuickReplies({ options, onSelect }) {
  return (
    <div className="quick-replies">
      {options.map((opt) => (
        <button key={opt.id} className="quick-reply-chip" onClick={() => onSelect(opt)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
