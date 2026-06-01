// =============================================================
// Chip — locked 2026-05-22.
//
// Mirrors prod target: apps/web/src/components/ui/Chip.tsx
//
// Tones    neutral | ocean | teal | green | amber | red
// Optional icon (Icon name, rendered at 10px)
//
// UPPERCASE + tracked + 4px radius — signals "encoded data".
// Never use for plain labels — see Components Review.html → §Chips & tags.
//
// Usage:
//   <Chip>AOWD</Chip>
//   <Chip tone="green" icon="check">Verified</Chip>
//   <Chip tone="amber">Pending</Chip>
// =============================================================

const { Icon } = window;

function Chip({
  tone = "neutral",
  icon,
  children,
  className = "",
  style,
  ...rest
}) {
  const toneCls = {
    neutral: "",
    ocean:   "chip-ocean",
    teal:    "chip-teal",
    green:   "chip-green",
    amber:   "chip-amber",
    red:     "chip-red",
  }[tone] || "";

  const cls = ["chip", toneCls, className].filter(Boolean).join(" ");

  return (
    <span className={cls} style={style} {...rest}>
      {icon && <Icon name={icon} size={10}/>}
      {typeof children === "string" ? children.toUpperCase() : children}
    </span>
  );
}

window.Chip = Chip;
