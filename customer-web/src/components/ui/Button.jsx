export function Button({
  children,
  variant = "primary",
  className = "",
  href,
  onClick,
  type = "button",
  disabled,
  ...rest
}) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold tracking-premium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary:
      "bg-ink text-white shadow-sm hover:bg-ink-secondary hover:shadow-md active:scale-[0.98]",
    secondary:
      "bg-white text-ink border border-border/90 shadow-xs hover:border-border hover:bg-surface hover:shadow-sm active:scale-[0.98]",
    accent:
      "bg-accent text-white shadow-sm hover:bg-accent-hover hover:shadow-md hover:shadow-accent/10 active:scale-[0.98]",
    ghost: "text-sub hover:text-ink hover:bg-surface/80",
  };
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
