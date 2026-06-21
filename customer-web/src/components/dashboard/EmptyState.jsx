import { Link } from "react-router-dom";

export function EmptyState({ icon: Icon, title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-white px-6 py-14 text-center">
      {Icon ? (
        <span className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-surface text-muted">
          <Icon size={22} />
        </span>
      ) : null}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-sub">{description}</p> : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-white hover:bg-[#0d6b63] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {actionLabel}
        </button>
      ) : null}
      {actionLabel && actionTo && !onAction ? (
        <Link
          to={actionTo}
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-white hover:bg-[#0d6b63] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
