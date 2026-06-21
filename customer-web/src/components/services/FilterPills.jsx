export function FilterPills({ items, value, onChange, ariaLabel }) {
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
            onClick={() => onChange(item.id)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-ink text-white shadow-sm"
                : "bg-white text-sub ring-1 ring-border/90 hover:text-ink hover:ring-border"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
