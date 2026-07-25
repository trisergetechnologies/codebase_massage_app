import { useEffect, useMemo, useState } from "react";
import { catalogService } from "../services/catalogService";
import { ServiceBookingCard } from "../components/services/ServiceBookingCard";
import { FilterPills } from "../components/services/FilterPills";
import { ServiceCardSkeleton } from "../components/services/ServiceCardSkeleton";
import { ServicesEmptyState } from "../components/services/ServicesEmptyState";
import {
  ServicesTopBar,
  loadStoredLocation,
} from "../components/services/ServicesTopBar";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { toastMessages } from "../lib/messages";
import {
  BODY_CATEGORIES,
  FEELING_FILTERS,
  filterServices,
} from "../lib/serviceFilters";

export function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [bodyCategory, setBodyCategory] = useState("all");
  const [feelingId, setFeelingId] = useState(null);
  const [location, setLocation] = useState(() => loadStoredLocation());
  const { add } = useCart();
  const toast = useToast();

  useEffect(() => {
    catalogService
      .listServices()
      .then(setServices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => filterServices(services, { bodyCategory, feelingId, query }),
    [services, bodyCategory, feelingId, query]
  );

  const serviceNames = useMemo(
    () => services.map((s) => s.name).filter(Boolean),
    [services]
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
      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 pb-16">
        <ServicesTopBar
          query={query}
          onQueryChange={setQuery}
          serviceNames={serviceNames}
          location={location}
          onLocationChange={setLocation}
        />

        {!loading && !error && (
          <div className="mt-4 flex flex-col gap-2.5 sm:mt-5">
            <FilterPills
              items={BODY_CATEGORIES}
              value={bodyCategory}
              onChange={setBodyCategory}
              ariaLabel="Body area"
            />
            <FilterPills
              items={FEELING_FILTERS}
              value={feelingId}
              onChange={setFeelingId}
              ariaLabel="Filter by feeling"
              allowDeselect
            />
          </div>
        )}

        {loading && (
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-border/70">
            <p className="font-medium text-ink">Couldn&apos;t load sessions</p>
            <p className="mt-2 text-sm text-sub">Check that the backend is running.</p>
          </div>
        )}

        {!loading && !error && (
          <section className="mt-5 sm:mt-6">
            <p className="mb-3 text-xs text-muted">
              {filtered.length} session{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {filtered.length === 0 ? (
                <div className="col-span-full">
                  <ServicesEmptyState onClear={hasFilters ? clearFilters : undefined} />
                </div>
              ) : (
                filtered.map((s) => (
                  <ServiceBookingCard key={s.id} service={s} onAdd={handleAdd} />
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
