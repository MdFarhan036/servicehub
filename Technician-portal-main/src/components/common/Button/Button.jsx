import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? "btn-full" : ""}`}
    >
      {Icon && iconPosition === "left" && <Icon className="btn-icon" />}
      <span>{children}</span>
      {Icon && iconPosition === "right" && <Icon className="btn-icon" />}
    </button>
  );
}
