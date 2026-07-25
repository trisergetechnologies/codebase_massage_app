import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MapPin, Navigation, Search, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import { useGeolocation } from "../../hooks/useGeolocation";
import { friendlyError } from "../../lib/messages";

const LOCATION_STORAGE_KEY = "services_location_context";

function formatAddressLabel(address) {
  if (!address) return "";
  const parts = [address.line1, address.city, address.pincode].filter(Boolean);
  return parts.join(", ") || address.label || "Saved address";
}

function loadStoredLocation() {
  try {
    const raw = sessionStorage.getItem(LOCATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeLocation(value) {
  try {
    if (value) sessionStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(LOCATION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Dual top bar: location (saved addresses + GPS) and live search with rotating placeholders.
 * Location is booking context only — does not filter the catalog.
 */
export function ServicesTopBar({
  query,
  onQueryChange,
  serviceNames = [],
  location,
  onLocationChange,
}) {
  const { isAuthenticated, user } = useAuth();
  const { openLogin } = useAuthModal();
  const { capture, loading: geoLoading, error: geoError } = useGeolocation();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const panelRef = useRef(null);

  const addresses = user?.addresses || [];
  const placeholders = useMemo(() => {
    const names = serviceNames.filter(Boolean);
    if (!names.length) return ["Search relief services…"];
    return names.map((n) => `Search ${n}…`);
  }, [serviceNames]);

  const rotating = !focused && !query.trim();

  useEffect(() => {
    if (!rotating || placeholders.length <= 1) return undefined;
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(id);
  }, [rotating, placeholders]);

  useEffect(() => {
    if (!location && !loadStoredLocation()) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddr) {
        const next = {
          type: "address",
          id: defaultAddr.id,
          label: defaultAddr.label || "Home",
          display: formatAddressLabel(defaultAddr),
          lat: defaultAddr.lat,
          lng: defaultAddr.lng,
        };
        onLocationChange?.(next);
        storeLocation(next);
      }
    }
  }, [addresses, location, onLocationChange]);

  useEffect(() => {
    function onDocClick(e) {
      if (!panelRef.current?.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  async function useCurrentLocation() {
    const coords = await capture();
    if (!coords) return;
    const next = {
      type: "gps",
      id: "gps",
      label: "Current location",
      display: "Current location",
      lat: coords.lat,
      lng: coords.lng,
    };
    onLocationChange?.(next);
    storeLocation(next);
    setOpen(false);
  }

  function selectAddress(address) {
    const next = {
      type: "address",
      id: address.id,
      label: address.label || "Home",
      display: formatAddressLabel(address),
      lat: address.lat,
      lng: address.lng,
    };
    onLocationChange?.(next);
    storeLocation(next);
    setOpen(false);
  }

  const locationLabel = location?.display || location?.label || "Select location";

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* Location */}
      <div className="relative" ref={panelRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-full items-center gap-3 rounded-2xl border border-border/80 bg-white px-4 text-left shadow-xs transition hover:border-accent/30"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <MapPin size={18} className="shrink-0 text-accent" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
            {locationLabel}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div
            className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-border/80 bg-white shadow-premium"
            role="listbox"
          >
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={geoLoading}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink transition hover:bg-accent-soft/50"
            >
              <Navigation size={16} className="shrink-0 text-accent" />
              <span className="flex-1 font-medium">
                {geoLoading ? "Getting location…" : "Use current location"}
              </span>
            </button>
            {geoError && (
              <p className="px-4 pb-2 text-xs text-red-600">{friendlyError(geoError)}</p>
            )}

            {isAuthenticated && addresses.length > 0 && (
              <div className="border-t border-border/70">
                <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Saved addresses
                </p>
                <ul className="py-1">
                  {addresses.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => selectAddress(a)}
                        className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left transition hover:bg-accent-soft/50 ${
                          location?.id === a.id ? "bg-accent-soft/40" : ""
                        }`}
                      >
                        <span className="text-sm font-semibold text-ink">
                          {a.label || "Home"}
                          {a.isDefault ? (
                            <span className="ml-2 text-[10px] font-medium uppercase text-accent">
                              Default
                            </span>
                          ) : null}
                        </span>
                        <span className="truncate text-xs text-sub">
                          {formatAddressLabel(a)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isAuthenticated && (
              <div className="border-t border-border/70 px-4 py-3">
                <p className="text-xs text-sub">Sign in to use saved addresses.</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openLogin({ intent: "services_location" });
                  }}
                  className="mt-2 text-sm font-semibold text-accent hover:text-accent-hover"
                >
                  Sign in
                </button>
              </div>
            )}

            {isAuthenticated && addresses.length === 0 && (
              <div className="border-t border-border/70 px-4 py-3">
                <p className="text-xs text-sub">No saved addresses yet.</p>
                <Link
                  to="/app/addresses"
                  className="mt-2 inline-block text-sm font-semibold text-accent hover:text-accent-hover"
                  onClick={() => setOpen(false)}
                >
                  Manage addresses
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholders[placeholderIndex % placeholders.length]}
          aria-label="Search relief services"
          className="h-12 w-full rounded-2xl border-0 bg-white pl-11 pr-10 text-sm text-ink shadow-xs ring-1 ring-border/80 placeholder:text-muted focus:ring-2 focus:ring-accent/20 focus:outline-none"
        />
        {query.trim() && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export { loadStoredLocation, storeLocation, LOCATION_STORAGE_KEY };
