import { STATUS_COLORS } from "../../../utils/constants";
import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: "var(--color-border-light)", text: "var(--color-text-gray)" };
  return (
    <span className="status-badge" style={{ background: colors.bg, color: colors.text }}>
      {status}
    </span>
  );
}
