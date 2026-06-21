import { Link } from "react-router-dom";
import { Radio } from "lucide-react";
import { sessionTitle } from "../../lib/dashboardStats";
import { ACTIVE_STATUSES, formatStatus } from "../../lib/bookingStatus";

export function LiveSessionBanner({ booking }) {
  if (!booking || !ACTIVE_STATUSES.includes(booking.status)) return null;

  const title = sessionTitle(booking);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-accent/25 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <span className="relative grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
          <Radio size={18} />
          <span className="absolute -right-0.5 -top-0.5 size-2.5 animate-pulse rounded-full bg-accent" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Live session</p>
          <p className="mt-1 font-semibold text-ink">{title}</p>
          <p className="mt-1 text-sm text-sub">
            {formatStatus(booking.status)}
            {booking.quotedEtaMin ? ` · ETA ${booking.quotedEtaMin} min` : ""}
          </p>
        </div>
      </div>
      <Link
        to={`/app/orders/${booking.id}`}
        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-white hover:bg-[#0d6b63]"
      >
        Track session
      </Link>
    </div>
  );
}
