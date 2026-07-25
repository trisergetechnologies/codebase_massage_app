import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { ArrowRight, HelpCircle, Home, LogOut, Package, User } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { getPageTitle, isOrderDetailRoute } from "../lib/dashboardRoutes";

import { Button } from "../components/ui/Button";



const navItems = [

  { to: "/app/orders", label: "My Sessions", icon: Package },

  { to: "/app/addresses", label: "Addresses", icon: Home },

  { to: "/app/profile", label: "Profile", icon: User },

  { to: "/app/support", label: "Support", icon: HelpCircle },

];



const mobileNavItems = [

  { to: "/app/orders", label: "Sessions", icon: Package },

  { to: "/app/profile", label: "Profile", icon: User },

  { to: "/app/support", label: "Support", icon: HelpCircle },

];



function userInitials(name) {

  if (!name?.trim()) return "?";

  const p = name.trim().split(/\s+/);

  if (p.length === 1) return p[0].charAt(0).toUpperCase();

  return (p[0].charAt(0) + p[p.length - 1].charAt(0)).toUpperCase();

}



function BottomNav() {

  return (

    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(15,20,25,0.06)] backdrop-blur-lg lg:hidden"
      aria-label="Account menu"

    >

      <div className="grid h-[60px] grid-cols-3">

        {mobileNavItems.map(({ to, icon: Icon, label }) => (

          <NavLink

            key={to}

            to={to}

            className={({ isActive }) =>

              `relative flex flex-col items-center justify-center gap-1 type-caption font-medium ${

                isActive ? "text-brand" : "text-muted"

              }`

            }

          >

            {({ isActive }) => (

              <>

                {isActive ? (

                  <span className="absolute top-0 h-0.5 w-10 rounded-full bg-brand" />

                ) : null}

                <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />

                <span>{label}</span>

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
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-border/80 bg-white shadow-sm lg:flex">
      <div className="border-b border-border/80 px-6 py-6">
        <NavLink to="/services" className="flex items-center gap-3 no-underline">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-sm font-bold text-white shadow-sm ring-1 ring-accent/20">
            R

          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold tracking-tight text-ink">
              Reliefhai
            </p>
            <p className="text-xs text-muted">Your account</p>
          </div>
        </NavLink>

      </div>



      <div className="border-b border-border px-6 pb-6">

        <div className="flex items-center gap-3">

          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-50 text-sm font-bold text-brand">

            {userInitials(user?.name)}

          </span>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-ink">{user?.name || "Account"}</p>

            <p className="truncate type-caption text-muted">{user?.phone}</p>

          </div>

        </div>

      </div>



      <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Account">

        {navItems.map(({ to, label, icon: Icon }) => (

          <NavLink

            key={to}

            to={to}

            end={to === "/app/orders"}

            className={({ isActive }) =>

              `relative flex min-h-11 items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-medium transition-default ${

                isActive

                  ? "border-l-[3px] border-brand bg-forest-50 font-semibold text-[var(--forest-700)]"

                  : "border-l-[3px] border-transparent text-sub hover:bg-sand"

              }`

            }

          >

            <Icon size={20} />

            {label}

          </NavLink>

        ))}

      </nav>



      <div className="border-t border-border p-4">

        <Button variant="primary" size="md" className="mb-4 w-full gap-2" onClick={onBook}>

          Book a session <ArrowRight size={16} />

        </Button>

        <button

          type="button"

          onClick={onSignOut}

          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 type-body-sm font-medium text-sub hover:bg-sand hover:text-ink"

        >

          <LogOut size={18} />

          Sign out

        </button>

      </div>

    </aside>

  );

}



function MobileHeader({ pageTitle }) {

  return (

    <header className="sticky top-0 z-30 border-b border-border bg-surface px-5 py-4 lg:hidden">

      <h1 className="type-h1 truncate text-ink">{pageTitle}</h1>

    </header>

  );

}



function DesktopTopBar({ pageTitle }) {

  return (

    <header className="sticky top-0 z-20 hidden border-b border-border bg-surface px-8 py-5 lg:block">

      <h1 className="type-h1 text-ink">{pageTitle}</h1>

    </header>

  );

}



export function DashboardLayout() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  const hideMobileNav = isOrderDetailRoute(location.pathname);



  function signOut() {

    logout();

    navigate("/");

  }



  function onBook() {

    navigate("/services");

  }



  return (
    <div className="min-h-screen bg-surface lg:bg-gradient-to-br lg:from-surface lg:via-white lg:to-surface">
      <DesktopSidebar user={user} onSignOut={signOut} onBook={onBook} />



      <div className="lg:pl-[280px]">

        <MobileHeader pageTitle={pageTitle} />

        <DesktopTopBar pageTitle={pageTitle} />



        <main

          className={`mx-auto w-full max-w-lg px-5 py-6 lg:max-w-5xl lg:px-8 lg:py-8 ${

            hideMobileNav ? "pb-8" : "pb-[calc(60px+env(safe-area-inset-bottom))] lg:pb-10"

          }`}

        >
          <div
            className={
              isOrderDetail
                ? "lg:p-0"
                : "lg:rounded-3xl lg:bg-white lg:p-8 lg:shadow-premium lg:ring-1 lg:ring-border/50"
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


