// =============================================================
// Button — locked 2026-05-22.
//
// Mirrors prod target: apps/web/src/components/ui/Button.tsx
//
// Variants    primary | secondary | ghost | danger | danger-solid
// Sizes       sm | md  (default md, 36px tall)
// Special     loading? · disabled? · icon (left) · iconOnly?
//
// Visual spec: see Components Review.html → §Buttons.
//
// Usage:
//   <Button variant="primary">Save changes</Button>
//   <Button variant="secondary" icon="download">Export</Button>
//   <Button variant="danger">Request suspension…</Button>
//   <Button size="sm" iconOnly icon="edit"/>
// =============================================================

const { Icon } = window;

function Button({
  variant = "primary",
  size = "md",
  icon,
  iconOnly = false,
  loading = false,
  disabled = false,
  onClick,
  children,
  style,
  className = "",
  ...rest
}) {
  const cls = [
    "btn",
    `btn-${variant}`,
    size === "sm" && "btn-sm",
    iconOnly && "btn-icon",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      className={cls}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      {...rest}>
      {loading ? (
        <Spinner size={size === "sm" ? 12 : 14}/>
      ) : (
        icon && <Icon name={icon} size={size === "sm" ? 12 : 14}/>
      )}
      {!iconOnly && children}
    </button>
  );
}

function Spinner({size}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden
         style={{animation:"btn-spin 1s linear infinite"}}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 28" opacity="0.85"/>
      <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

window.Button = Button;
