import { Link, useNavigate } from "react-router-dom";
import { SessionStatusBadge } from "./SessionStatusBadge";
import {
  sessionTitle,
  formatSessionDate,
  formatCurrency,
} from "../../lib/dashboardStats";
import {
  ACTIVE_STATUSES,
  COMPLETED_STATUSES,
} from "../../lib/bookingStatus";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState } from "./EmptyState";
import { Package } from "lucide-react";

const COLUMNS = ["Session", "Status", "Expert", "Date", "Amount", ""];

export function SessionsTable({ rows, loading, emptyTitle, emptyDescription, emptyAction }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-border px-4 py-4 last:border-0">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!rows?.length) {
    return (
      <EmptyState
        icon={Package}
        title={emptyTitle || "No sessions"}
        description={emptyDescription}
        actionLabel={emptyAction?.label}
        actionTo={emptyAction?.to}
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/80">
              {COLUMNS.map((col) => (
                <th
                  key={col || "actions"}
                  scope="col"
                  className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((booking) => (
              <SessionTableRow key={booking.id} booking={booking} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked rows */}
      <div className="space-y-3 md:hidden">
        {rows.map((booking) => (
          <SessionMobileRow key={booking.id} booking={booking} />
        ))}
      </div>
    </>
  );
}

function SessionTableRow({ booking }) {
  const navigate = useNavigate();
  const title = sessionTitle(booking);
  const isActive = ACTIVE_STATUSES.includes(booking.status);

  return (
    <tr
      className="cursor-pointer border-b border-border last:border-0 hover:bg-surface/50"
      onClick={() => navigate(`/app/orders/${booking.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/app/orders/${booking.id}`);
        }
      }}
      tabIndex={0}
      role="link"
    >
      <td className="px-4 py-3.5 font-medium text-ink">{title}</td>
      <td className="px-4 py-3.5">
        <SessionStatusBadge status={booking.status} />
      </td>
      <td className="px-4 py-3.5 text-sub">{booking.expert?.name || "—"}</td>
      <td className="px-4 py-3.5 text-sub whitespace-nowrap">
        {formatSessionDate(booking.createdAt)}
      </td>
      <td className="px-4 py-3.5 font-medium text-ink">
        {formatCurrency(booking.pricing?.total)}
      </td>
      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
        <SessionActions booking={booking} isActive={isActive} />
      </td>
    </tr>
  );
}

function SessionMobileRow({ booking }) {
  const title = sessionTitle(booking);
  const isActive = ACTIVE_STATUSES.includes(booking.status);

  return (
    <article className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-ink">{title}</p>
          <p className="mt-1 text-xs text-muted">{formatSessionDate(booking.createdAt)}</p>
        </div>
        <SessionStatusBadge status={booking.status} />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-sub">{booking.expert?.name || "Expert pending"}</span>
        <span className="font-medium text-ink">{formatCurrency(booking.pricing?.total)}</span>
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <SessionActions booking={booking} isActive={isActive} />
      </div>
    </article>
  );
}

function SessionActions({ booking, isActive }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to={`/app/orders/${booking.id}`}
        className="text-sm font-medium text-accent hover:text-[#0d6b63] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {isActive ? "Track" : "View"}
      </Link>
      {COMPLETED_STATUSES.includes(booking.status) && (
        <Link to="/services" className="text-sm font-medium text-muted hover:text-ink">
          Rebook
        </Link>
      )}
    </div>
  );
}
