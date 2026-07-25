import { Button } from "./Button";

export function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center px-6 py-16 text-center ${className}`}>
      {Icon ? (
        <div className="mb-4 grid size-14 place-items-center rounded-full bg-surface-2 text-muted">
          <Icon size={28} strokeWidth={1.5} />
        </div>
      ) : null}
      <h3 className="type-h2 text-ink">{title}</h3>
      {message ? <p className="mt-2 max-w-sm type-body text-sub">{message}</p> : null}
      {actionLabel && onAction ? (
        <Button variant="primary" size="md" className="mt-6 min-w-0" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
