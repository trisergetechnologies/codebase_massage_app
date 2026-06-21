export function SegmentedControl({ options, value, onChange }) {
  return (
    <div
      className="flex gap-1 overflow-x-auto border-b border-border"
      role="tablist"
      aria-label="Filter sessions"
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${
            value === opt.id
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-sub"
          }`}
        >
          {opt.label}
          {opt.count != null ? (
            <span className="ml-1.5 text-xs text-muted">({opt.count})</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
