export function ServicesEmptyState({ onClear }) {
  return (
    <div className="rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-border/70 sm:py-20">
      <p className="text-lg font-semibold text-ink">No matching sessions found</p>
      <p className="mt-2 text-sm text-sub">Try another category or feeling.</p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 text-sm font-medium text-accent hover:text-[#0d6b63]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
