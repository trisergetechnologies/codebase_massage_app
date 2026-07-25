const VARIANTS = {
  live: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  muted: "bg-surface-2 text-muted",
  brand: "bg-accent-soft text-brand",
};

export function Chip({ children, variant = "muted", className = "", pulse = false, ...rest }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-chip px-2.5 py-1 type-label normal-case tracking-normal text-[11px] font-semibold ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {pulse ? (
        <span className="size-1.5 animate-pulse-live rounded-full bg-current" aria-hidden />
      ) : null}
      {children}
    </span>
  );
}
