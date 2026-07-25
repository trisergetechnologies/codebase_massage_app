import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { catalogService } from "../services/catalogService";
import { ServiceBookingCard } from "../components/services/ServiceBookingCard";
import { FeaturedSessions } from "../components/services/FeaturedSessions";
import { FilterPills } from "../components/services/FilterPills";
import { ServiceCardSkeleton } from "../components/services/ServiceCardSkeleton";
import { ServicesEmptyState } from "../components/services/ServicesEmptyState";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { toastMessages } from "../lib/messages";
import {
  BODY_CATEGORIES,
  FEELING_FILTERS,
  TRUST_ITEMS,
  filterServices,
  getPopularServices,
} from "../lib/serviceFilters";

export function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [bodyCategory, setBodyCategory] = useState("all");
  const [feelingId, setFeelingId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { add } = useCart();
  const toast = useToast();

  useEffect(() => {
    catalogService
      .listServices()
      .then(setServices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const popular = useMemo(() => getPopularServices(services), [services]);

  const filtered = useMemo(
    () => filterServices(services, { bodyCategory, feelingId, query }),
    [services, bodyCategory, feelingId, query]
  );

  const popularIds = useMemo(() => new Set(popular.map((s) => s.id)), [popular]);

  const gridServices = useMemo(
    () => filtered.filter((s) => !popularIds.has(s.id)),
    [filtered, popularIds]
  );

  const hasFilters = bodyCategory !== "all" || feelingId || query.trim();

  function handleAdd(service) {
    add(service);
    toast.success(toastMessages.cartAdded);
  }

  function clearFilters() {
    setBodyCategory("all");
    setFeelingId(null);
    setQuery("");
  }

  return (
    <div className="min-h-screen bg-premium-gradient">
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <header className="max-w-2xl">
          <p className="eyebrow">Book a session</p>
          <h1 className="mt-3 font-display text-[1.85rem] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-4xl sm:leading-[1.08]">
            What would you like relief from today?
          </h1>
          <p className="mt-4 text-base leading-7 text-sub sm:text-lg">
            Verified experts at your door — transparent pricing, professional service.
          </p>
        </header>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 rounded-2xl border border-border/60 bg-white/80 px-5 py-4 shadow-xs sm:gap-x-10">
          {TRUST_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-sub">
              <span className="text-accent" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        {loading && (
          <>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <ServiceCardSkeleton key={i} featured />
              ))}
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {!loading && error && (
          <div className="mt-12 rounded-2xl bg-white px-6 py-14 text-center ring-1 ring-border/70">
            <p className="font-medium text-ink">Couldn&apos;t load sessions</p>
            <p className="mt-2 text-sm text-sub">Check that the backend is running.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <FeaturedSessions services={popular} onAdd={handleAdd} />

            <section className="mt-12 sm:mt-14">
              <h2 className="text-sm font-semibold text-ink">How are you feeling?</h2>
              <div className="mt-4">
                <FilterPills
                  items={FEELING_FILTERS}
                  value={feelingId}
                  onChange={(id) => setFeelingId(feelingId === id ? null : id)}
                  ariaLabel="Filter by feeling"
                />
              </div>
            </section>

            <section className="mt-10 sm:mt-12">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-ink">Browse sessions</h2>
                <button
                  type="button"
                  onClick={() => setSearchOpen((o) => !o)}
                  className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-[#0d6b63] lg:hidden"
                  aria-expanded={searchOpen}
                >
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="mt-4 hidden lg:block">
                <SearchField query={query} onQueryChange={setQuery} />
              </div>
              {searchOpen && (
                <div className="mt-3 lg:hidden">
                  <SearchField query={query} onQueryChange={setQuery} />
                </div>
              )}

              <div className="mt-5">
                <FilterPills
                  items={BODY_CATEGORIES}
                  value={bodyCategory}
                  onChange={setBodyCategory}
                  ariaLabel="Body area"
                />
              </div>

              <p className="mt-4 text-xs text-muted">
                {filtered.length} session{filtered.length === 1 ? "" : "s"}
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {filtered.length === 0 ? (
                  <div className="sm:col-span-2">
                    <ServicesEmptyState onClear={hasFilters ? clearFilters : undefined} />
                  </div>
                ) : gridServices.length === 0 ? (
                  <p className="sm:col-span-2 text-sm text-sub">
                    All matching sessions are shown above.
                  </p>
                ) : (
                  gridServices.map((s) => (
                    <ServiceBookingCard key={s.id} service={s} onAdd={handleAdd} />
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>

    </div>
  );
}

function SearchField({ query, onQueryChange }) {
  const hasQuery = query.trim().length > 0;
  return (
    <div className="relative max-w-md">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search sessions"
        aria-label="Search sessions"
        className="h-11 w-full rounded-xl border-0 bg-white pl-11 pr-10 text-sm text-ink ring-1 ring-border/80 placeholder:text-muted focus:ring-2 focus:ring-accent/20 focus:outline-none"
      />
      {hasQuery && (
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
  );
}
