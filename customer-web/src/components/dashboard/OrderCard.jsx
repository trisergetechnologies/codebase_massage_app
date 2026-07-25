import { Link } from "react-router-dom";

import { formatStatusChip } from "../../lib/bookingStatus";

import { LIVE_TRACKING_STATUSES } from "../../lib/bookingJourney";

import { sessionTitle, formatSessionDate, formatCurrency } from "../../lib/dashboardStats";

import { Chip } from "../ui/Chip";



export function OrderCard({ booking, className = "", active = false }) {

  const title = sessionTitle(booking);

  const statusChip = formatStatusChip(booking.status, booking);

  const isLive = LIVE_TRACKING_STATUSES.includes(booking.status);



  return (

    <Link

      to={`/app/orders/${booking.id}`}

      className={`block min-h-[76px] rounded-card-sm p-4 transition-default active:scale-[0.99] ${

        active || isLive

          ? "border border-forest-200 bg-forest-50 shadow-xs"

          : "border border-border bg-surface shadow-xs hover:border-border-brand"

      } ${className}`}

    >

      <div className="flex items-start justify-between gap-3">

        <p className="type-body font-semibold text-ink">{title}</p>

        {isLive ? <Chip variant="live" pulse>Live</Chip> : null}

      </div>

      <div className="mt-2 flex items-center justify-between gap-3">

        <p className="type-caption text-muted">

          {formatSessionDate(booking.createdAt)} · {formatCurrency(booking.pricing?.total)}

        </p>

        <Chip variant={isLive ? "brand" : "muted"}>{statusChip}</Chip>

      </div>

    </Link>

  );

}


