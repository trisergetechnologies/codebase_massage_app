import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, MapPin, Menu, Package, ShoppingBag, User } from "lucide-react";
import { SideDrawer } from "../ui/SideDrawer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import { UserMenu } from "./UserMenu";

function pageLinks(isAuthenticated) {
  if (isAuthenticated) {
    return [
      { to: "/services", label: "Services" },
      { to: "/support", label: "Support" },
    ];
  }
  return [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" }
  ];
}

function CartButton({ onClick, count, className = "", inverted = false }) {
  return (
    <button
      type="button"
      className={`relative grid size-10 shrink-0 place-items-center rounded-full border shadow-sm transition sm:size-11 ${
        inverted
          ? "border-white/20 bg-white/10 text-white hover:border-white/40"
          : "border-border/80 bg-white/80 text-ink hover:border-accent/30"
      } ${className}`}
      onClick={onClick}
      aria-label={`Cart, ${count} items`}
    >
      <ShoppingBag size={20} strokeWidth={1.75} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroNav, setHeroNav] = useState(false);
  const { totals, setOpen: setCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { openLogin } = useAuthModal();
  const links = pageLinks(isAuthenticated);
  const homeTo = isAuthenticated ? "/services" : "/";
  const onLanding = location.pathname === "/" && !isAuthenticated;
  const lightLanding = onLanding;

  useEffect(() => {
    if (!onLanding) {
      setHeroNav(false);
      return;
    }
    function onScroll() {
      setHeroNav(window.scrollY < 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onLanding]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function signOut() {
    logout();
    closeMenu();
    navigate("/");
  }

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-colors duration-default ease-out ${
          lightLanding && heroNav
            ? "border-b border-transparent bg-transparent text-ink"
            : "border-b border-border bg-surface/95 text-ink shadow-sm backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-14 min-h-[56px] max-w-content items-center justify-between gap-2 px-5 sm:px-6 md:px-8">
          <Link
            to={homeTo}
            className="flex min-w-0 items-center gap-2 no-underline text-ink sm:gap-3"
            onClick={closeMenu}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-xs font-bold text-white sm:size-10 sm:text-sm">
              R
            </span>
            <span className="hidden truncate text-sm font-semibold sm:inline">
              R · Relief, Delivered
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="type-body font-medium text-sub transition hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/services"
              className="inline-flex h-10 min-h-[40px] items-center justify-center rounded-btn bg-accent px-5 text-sm font-semibold text-white shadow-sm transition-default hover:bg-[var(--color-primary-hover)]"
            >
              Book now
            </Link>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <CartButton onClick={() => setCartOpen(true)} count={totals.count} />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button
                type="button"
                onClick={() => openLogin()}
                className="grid size-11 place-items-center rounded-full border border-border bg-surface text-sub shadow-sm hover:text-brand"
                aria-label="Sign in"
              >
                <LogIn size={20} strokeWidth={1.75} />
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 md:hidden">
            <CartButton onClick={() => setCartOpen(true)} count={totals.count} />
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border border-border bg-surface text-ink shadow-sm"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <SideDrawer
        open={menuOpen}
        onClose={closeMenu}
        title="Menu"
        ariaLabel="Navigation menu"
      >
        {isAuthenticated && user && (
          <div className="mb-4 rounded-xl bg-accent-soft px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{user.name || "Account"}</p>
            <p className="truncate text-xs text-sub">{user.phone}</p>
          </div>
        )}

        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {isAuthenticated && (
            <>
              <Link
                to="/app/orders"
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium text-ink active:bg-surface"
                onClick={closeMenu}
              >
                <Package size={18} className="text-accent" />
                My Orders
              </Link>
              <Link
                to="/app/addresses"
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium text-ink active:bg-surface"
                onClick={closeMenu}
              >
                <MapPin size={18} className="text-accent" />
                My Addresses
              </Link>
              <Link
                to="/app/profile"
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium text-ink active:bg-surface"
                onClick={closeMenu}
              >
                <User size={18} className="text-accent" />
                Account
              </Link>
              <div className="my-2 border-t border-border" />
            </>
          )}

          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-xl px-4 py-3.5 text-[15px] font-medium text-ink active:bg-surface"
              onClick={closeMenu}
            >
              {l.label}
            </Link>
          ))}

          {!isAuthenticated && (
            <button
              type="button"
              className="mt-1 rounded-xl px-4 py-3.5 text-left text-[15px] font-semibold text-accent active:bg-surface"
              onClick={() => {
                closeMenu();
                openLogin();
              }}
            >
              Login
            </button>
          )}

          {isAuthenticated && (
            <button
              type="button"
              className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium text-sub active:bg-surface"
              onClick={signOut}
            >
              <LogOut size={18} />
              Sign out
            </button>
          )}
        </nav>
      </SideDrawer>
    </>
  );
}
