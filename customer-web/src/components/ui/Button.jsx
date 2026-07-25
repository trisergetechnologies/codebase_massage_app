import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-accent text-white shadow-sm hover:bg-[var(--color-primary-hover)] hover:-translate-y-px hover:shadow-md active:bg-[var(--color-primary-press)] active:translate-y-0 active:shadow-xs disabled:opacity-[0.38]",
  secondary:
    "bg-transparent text-ink border-[1.5px] border-border-default hover:bg-sand-deep hover:border-border-brand disabled:opacity-[0.38]",
  ghost: "bg-transparent text-brand hover:bg-forest-50/60 disabled:opacity-[0.38]",
  danger: "bg-error text-white hover:opacity-90 disabled:opacity-[0.38]",
  inverse: "bg-white text-forest hover:bg-sand-deep disabled:opacity-[0.38]",
};

const SIZES = {
  lg: "min-h-[52px] md:min-h-12 px-6 text-[15px] font-semibold",
  md: "min-h-11 px-5 text-[13px] font-semibold",
  sm: "min-h-9 px-4 text-[13px] font-semibold",
};

export function Button({
  children,
  variant = "primary",
  size = "lg",
  className = "",
  href,
  onClick,
  type = "button",
  loading = false,
  disabled,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-btn font-sans transition-default duration-default ease-out focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent min-w-[120px]";
  const cls = `${base} ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.lg} ${className}`;

  const content = loading ? (
    <Loader2 className="size-5 animate-spin" aria-hidden />
  ) : (
    children
  );

  if (href) {
    return (
      <a href={href} className={cls} aria-busy={loading} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {content}
    </button>
  );
}
