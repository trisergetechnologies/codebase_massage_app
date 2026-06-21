import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../services/bookingService";
import { computeDashboardStats, formatCurrency } from "../../lib/dashboardStats";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { LiveSessionBanner } from "../../components/dashboard/LiveSessionBanner";
import { SessionsTable } from "../../components/dashboard/SessionsTable";
import { Button } from "../../components/ui/Button";

export function DashboardHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService
      .list()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = computeDashboardStats(bookings, user?.addresses?.length || 0);
  const liveSession = stats.activeSessions[0];
  const insight =
    stats.completedCount > 0
      ? `${stats.completedCount} session${stats.completedCount === 1 ? "" : "s"} completed · ${formatCurrency(stats.totalSpend)} total`
      : "Book your first at-home wellness session.";

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={insight}
        action={
          <Button variant="accent" onClick={() => navigate("/services")}>
            Book session
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Completed sessions"
          value={stats.completedCount}
          subtext={stats.totalMinutes ? `${stats.totalMinutes} min total` : undefined}
          loading={loading}
        />
        <MetricCard
          label="Active now"
          value={stats.activeCount}
          subtext={stats.activeCount ? "In progress" : "None scheduled"}
          loading={loading}
        />
        <MetricCard
          label="Total spend"
          value={formatCurrency(stats.totalSpend)}
          loading={loading}
        />
        <MetricCard
          label="Saved locations"
          value={stats.addressCount}
          loading={loading}
        />
      </div>

      {!loading && liveSession && (
        <div className="mb-8">
          <LiveSessionBanner booking={liveSession} />
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Recent sessions
          </h2>
          <Link to="/app/orders" className="text-sm font-medium text-accent hover:text-[#0d6b63]">
            View all
          </Link>
        </div>
        <SessionsTable
          rows={stats.recentSessions.slice(0, 5)}
          loading={loading}
          emptyTitle="No sessions yet"
          emptyDescription="When you book a session, it will appear here with status and details."
          emptyAction={{ label: "Browse services", to: "/services" }}
        />
      </section>

      <div className="mt-8 flex flex-wrap gap-6 border-t border-border pt-6 text-sm">
        <Link to="/services" className="font-medium text-accent hover:text-[#0d6b63]">
          Book a session
        </Link>
        <Link to="/app/addresses" className="font-medium text-sub hover:text-ink">
          Manage locations
        </Link>
        <Link to="/app/support" className="font-medium text-sub hover:text-ink">
          Help center
        </Link>
      </div>
    </div>
  );
}
