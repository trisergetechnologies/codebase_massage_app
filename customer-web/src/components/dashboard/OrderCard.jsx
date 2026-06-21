import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { formatStatus } from "../../lib/bookingStatus";
import {
  sessionTitle,
  formatSessionDate,
  formatCurrency,
} from "../../lib/dashboardStats";

export function OrderCard({ booking, className = "" }) {
  const title = sessionTitle(booking);
  const statusLabel = formatStatus(booking.status);

  return (
    <Link
      to={`/app/orders/${booking.id}`}
      className={`flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-accent/30 active:scale-[0.99] lg:p-5 lg:hover:shadow-md ${className}`}
    >
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
        <span className="text-lg font-semibold">{title.charAt(0)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-sub">{formatSessionDate(booking.createdAt)}</p>
        <p className="mt-1 text-sm font-medium text-accent">{statusLabel}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold text-ink">{formatCurrency(booking.pricing?.total)}</span>
        <ChevronRight size={18} className="text-muted" />
      </div>
    </Link>
  );
}
