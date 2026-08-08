export function SectionHeader({ label, title, description, align = "center", className = "", light = false }) {
  const alignCls =
    align === "left" ? "text-left items-start" : "text-center items-center mx-auto";

  return (
    <header className={`mb-8 md:mb-10 flex max-w-3xl flex-col gap-3 ${alignCls} ${className}`}>
      {label ? (
        <p className={light ? "eyebrow-light" : "eyebrow"}>{label}</p>
      ) : null}
      <h2
        className={`font-display text-section font-extrabold tracking-tight md:text-section-lg ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`text-lg leading-8 md:text-xl md:leading-9 ${
            light ? "text-white/75" : "text-sub"
          }`}
        >
          {description}
        </p>
      ) : null}
      <div
        className={`mt-2 h-px w-16 ${align === "left" ? "" : "mx-auto"} ${
          light ? "bg-white/20" : "bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        }`}
        aria-hidden
      />
    </header>
  );
}
