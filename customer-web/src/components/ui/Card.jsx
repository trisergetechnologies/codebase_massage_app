export function Card({ children, className = "", variant = "surface", as: Tag = "div", ...rest }) {
  const variants = {
    surface: "bg-surface border border-border shadow-sm rounded-card p-5",
    hero: "hero-card-dark text-white p-6",
    flat: "bg-surface border border-border rounded-card p-5",
    active: "bg-forest-50 border border-forest-200 rounded-card-sm p-4",
  };

  return (
    <Tag className={`${variants[variant] || variants.surface} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
