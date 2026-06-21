export function SectionHeader({ label, title, description, align = "center", className = "" }) {
  const alignCls = align === "left" ? "text-left items-start" : "text-center items-center mx-auto";
  return (
    <header className={`mb-12 md:mb-16 flex max-w-3xl flex-col gap-4 ${alignCls} ${className}`}>
      {label ? (
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">{label}</p>
      ) : null}
      <h2 className="font-display text-section font-extrabold tracking-tight text-ink md:text-section-lg">
        {title}
      </h2>
      {description ? (
        <p className="text-lg leading-8 text-sub md:text-xl md:leading-9">{description}</p>
      ) : null}
    </header>
  );
}
