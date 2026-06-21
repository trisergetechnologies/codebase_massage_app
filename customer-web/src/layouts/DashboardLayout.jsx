import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { HelpCircle, LogOut, MapPin, Package, Plus, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getPageTitle, isOrderDetailRoute } from "../lib/dashboardRoutes";
import { Button } from "../components/ui/Button";

const navItems = [
  { to: "/app/orders", label: "My Orders", icon: Package },
  { to: "/app/addresses", label: "My Addresses", icon: MapPin },
  { to: "/app/profile", label: "Account", icon: User },
  { to: "/app/support", label: "Support", icon: HelpCircle },
];

const bottomLabels = {
  "/app/orders": "Orders",
  "/app/addresses": "Addresses",
  "/app/profile": "Account",
  "/app/support": "Support",
};

function userInitials(name) {
  if (!name?.trim()) return "?";
  const p = name.trim().split(/\s+/);
  if (p.length === 1) return p[0].charAt(0).toUpperCase();
  return (p[0].charAt(0) + p[p.length - 1].charAt(0)).toUpperCase();
}

function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Account menu"
    >
      <div className="grid grid-cols-4">
        {navItems.map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-medium ${
                isActive ? "text-accent" : "text-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
                <span>{bottomLabels[to]}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function DesktopSidebar({ user, onSignOut, onBook }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-border bg-white lg:flex">
      <div className="border-b border-border px-6 py-6">
        <NavLink to="/services" className="flex items-center gap-3 no-underline">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-sm font-bold text-white">
            R
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">Relief, Delivered</p>
            <p className="text-xs text-muted">Your account</p>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Account">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/app/orders"}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-sub hover:bg-surface hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-accent" />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <Button variant="accent" className="mb-4 w-full min-h-11 gap-2" onClick={onBook}>
          <Plus size={18} />
          Book a session
        </Button>

        <div className="mb-3 flex items-center gap-3 rounded-xl bg-surface px-3 py-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-sm font-bold text-accent ring-1 ring-border">
            {userInitials(user?.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user?.name || "Account"}</p>
            <p className="truncate text-xs text-muted">{user?.phone}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-sub hover:bg-surface hover:text-ink"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

function BrowseServicesLink({ className = "" }) {
  return (
    <Link
      to="/services"
      className={`shrink-0 text-sm font-medium text-accent hover:text-[#0d6b63] ${className}`}
    >
      Browse services
    </Link>
  );
}

function MobileHeader({ user, pageTitle }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white px-4 py-4 lg:hidden">
      <div className="mx-auto flex max-w-lg items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-sub">
            {user?.name ? `Hi, ${user.name.split(" ")[0]}` : "Welcome"}
          </p>
          <h1 className="truncate text-xl font-semibold text-ink">{pageTitle}</h1>
        </div>
        <BrowseServicesLink className="pt-1" />
      </div>
    </header>
  );
}

function DesktopTopBar({ pageTitle }) {
  return (
    <header className="sticky top-0 z-20 hidden border-b border-border bg-white/95 px-8 py-5 backdrop-blur-md lg:block">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Account</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{pageTitle}</h1>
        </div>
        <BrowseServicesLink />
      </div>
    </header>
  );
}

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const hideMobileNav = isOrderDetailRoute(location.pathname);
  const isOrderDetail = hideMobileNav;

  function signOut() {
    logout();
    navigate("/");
  }

  function onBook() {
    navigate("/services");
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] lg:bg-surface">
      <DesktopSidebar user={user} onSignOut={signOut} onBook={onBook} />

      <div className="lg:pl-[260px]">
        <MobileHeader user={user} pageTitle={pageTitle} />
        <DesktopTopBar pageTitle={pageTitle} />

        <main
          className={`mx-auto w-full max-w-lg px-4 py-6 lg:max-w-5xl lg:px-8 lg:py-8 ${
            hideMobileNav ? "pb-8 lg:pb-8" : "pb-24 lg:pb-10"
          }`}
        >
          <div
            className={
              isOrderDetail
                ? "lg:p-0"
                : "lg:rounded-2xl lg:bg-white lg:p-8 lg:shadow-sm lg:ring-1 lg:ring-border/60"
            }
          >
            <Outlet />
          </div>
        </main>
      </div>

      {!hideMobileNav && <BottomNav />}
    </div>
  );
}
