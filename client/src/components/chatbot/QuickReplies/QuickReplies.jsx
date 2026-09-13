import "./QuickReplies.css";

export default function QuickReplies({
  options = [],
  onSelect,
  disabled = false,
}) {
  if (!options.length) {
    return null;
  }

  return (
    <div className="quick-replies">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className="quick-reply-chip"
          disabled={disabled}
          onClick={() => onSelect(opt)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}