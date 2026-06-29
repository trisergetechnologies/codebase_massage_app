import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { formatStatus } from "../../lib/bookingStatus";
import {
  sessionTitle,
  formatSessionDate,
  formatCurrency,
} from "../../lib/dashboardStats";
import { SessionStatusBadge } from "./SessionStatusBadge";

export function OrderCard({ booking, className = "" }) {
  const title = sessionTitle(booking);

  return (
    <Link
      to={`/app/orders/${booking.id}`}
      className={`group flex items-center gap-4 rounded-2xl border border-border/80 bg-white p-4 shadow-sm transition-all duration-300 hover:border-accent/25 hover:shadow-premium active:scale-[0.99] lg:p-5 ${className}`}
    >
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-soft to-white text-accent ring-1 ring-accent/10">
        <span className="font-display text-lg font-bold">{title.charAt(0)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold tracking-tight text-ink group-hover:text-accent transition-colors">
          {title}
        </p>
        <p className="mt-0.5 text-sm text-muted">{formatSessionDate(booking.createdAt)}</p>
        <div className="mt-2">
          <SessionStatusBadge status={booking.status} />
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-display text-sm font-bold text-ink">
          {formatCurrency(booking.pricing?.total)}
        </span>
        <ChevronRight
          size={18}
          className="text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>
    </Link>
  );
}
