export function FilterPills({ items, value, onChange, ariaLabel, allowDeselect = false }) {
  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0"
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              if (allowDeselect && active) onChange(null);
              else onChange(item.id);
            }}
            className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-accent text-white shadow-sm"
                : "bg-white text-sub ring-1 ring-border/90 hover:text-ink hover:ring-accent/30"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
