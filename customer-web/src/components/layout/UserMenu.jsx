import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, MapPin, Package, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function initials(name) {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function signOut() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <div className="relative hidden md:block" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative grid size-11 place-items-center rounded-full bg-gradient-to-br from-accent to-[#0d9488] p-[2px] shadow-sm transition hover:shadow-md"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        <span className="grid size-full place-items-center rounded-full bg-white text-sm font-bold text-accent">
          {initials(user?.name)}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border/80 bg-white py-1 shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{user?.name || "Account"}</p>
            <p className="truncate text-xs text-muted">{user?.phone}</p>
          </div>
          <Link
            to="/app/orders"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-sub hover:bg-surface hover:text-ink"
            onClick={() => setOpen(false)}
          >
            <Package size={16} />
            My Orders
          </Link>
          <Link
            to="/app/addresses"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-sub hover:bg-surface hover:text-ink"
            onClick={() => setOpen(false)}
          >
            <MapPin size={16} />
            My Addresses
          </Link>
          <Link
            to="/app/profile"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-sub hover:bg-surface hover:text-ink"
            onClick={() => setOpen(false)}
          >
            <User size={16} />
            Account
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 border-t border-border px-4 py-2.5 text-sm text-sub hover:bg-surface hover:text-ink"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
