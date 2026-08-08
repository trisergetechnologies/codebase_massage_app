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
    { to: "/services", label: "Services" },
    { to: "/cities", label: "Cities" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/about-us", label: "About Us" },
    { to: "/support", label: "Support" },
    { to: "/careers", label: "Careers" },
  ];
}

function CartButton({ onClick, count, className = "" }) {
  return (
    <button
      type="button"
      className={`relative grid size-10 shrink-0 place-items-center rounded-full border border-accent bg-accent text-white shadow-sm transition hover:bg-accent-hover sm:size-11 ${className}`}
      onClick={onClick}
      aria-label={`Cart, ${count} items`}
    >
      <ShoppingBag size={20} strokeWidth={1.75} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-bold text-accent">
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
  const { totals, setOpen: setCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { openLogin } = useAuthModal();
  const links = pageLinks(isAuthenticated);
  const homeTo = isAuthenticated ? "/services" : "/";

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
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/90 text-ink shadow-xs backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-16 min-h-[4rem] max-w-[1200px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 md:h-[4.75rem] md:px-8">
          <Link
            to={homeTo}
            className="flex min-w-0 items-center gap-2 text-ink no-underline sm:gap-3"
            onClick={closeMenu}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent font-display text-xs font-extrabold tracking-tight text-white shadow-sm ring-1 ring-accent/20 sm:size-10 sm:text-sm">
              R
            </span>
            <span className="hidden truncate font-display text-[15px] font-bold tracking-tight sm:inline">
              ReliefHai
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[15px] font-medium text-sub transition hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <CartButton onClick={() => setCartOpen(true)} count={totals.count} />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button
                type="button"
                onClick={() => openLogin()}
                className="grid size-11 place-items-center rounded-full border border-border/80 bg-accent text-white shadow-sm transition hover:bg-accent-hover"
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
              className="grid size-11 place-items-center rounded-full border border-border/80 bg-accent text-white shadow-sm transition hover:bg-accent-hover"
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
