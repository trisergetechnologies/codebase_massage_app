export function Button({ children, variant = "primary", className = "", href, onClick, type = "button", ...rest }) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const variants = {
    primary: "bg-ink text-white hover:bg-[#1f2937] shadow-sm",
    secondary: "bg-white text-ink border border-border hover:bg-surface shadow-sm",
    accent: "bg-accent text-white hover:bg-[#0d6b63] shadow-sm",
    ghost: "text-sub hover:text-ink hover:bg-surface",
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
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
