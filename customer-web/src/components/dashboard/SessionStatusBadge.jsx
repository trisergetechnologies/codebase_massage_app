import { formatStatus } from "../../lib/bookingStatus";
import { ACTIVE_STATUSES, COMPLETED_STATUSES, CANCELLED_STATUSES } from "../../lib/bookingStatus";

const toneMap = {
  active: "bg-accent-soft text-accent",
  completed: "bg-surface text-sub",
  cancelled: "bg-red-50 text-red-700",
  default: "bg-surface text-sub",
};

export function SessionStatusBadge({ status }) {
  let tone = toneMap.default;
  if (ACTIVE_STATUSES.includes(status)) tone = toneMap.active;
  else if (COMPLETED_STATUSES.includes(status)) tone = toneMap.completed;
  else if (CANCELLED_STATUSES.includes(status)) tone = toneMap.cancelled;

  return (
    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold tracking-wide ${tone}`}>
      {formatStatus(status)}
    </span>
  );
}
