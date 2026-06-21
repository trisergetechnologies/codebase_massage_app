import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock, Home, IndianRupee, Plus, Shield } from "lucide-react";
import { catalogService } from "../services/catalogService";
import { getServiceImage } from "../lib/serviceImages";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { toastMessages } from "../lib/messages";
import { brand } from "../content/brand";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";

const INCLUDES = [
  { icon: Home, text: "Expert comes to your address" },
  { icon: Shield, text: "Trained & verified professional" },
  { icon: IndianRupee, text: "Fixed price — no hidden fees" },
];

export function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const toast = useToast();

  const [service, setService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([catalogService.getService(id), catalogService.listCategories()])
      .then(([svc, cats]) => {
        if (!cancelled) {
          setService(svc);
          setCategories(cats);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "not_found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const categoryLabels = useMemo(() => {
    if (!service?.categories?.length) return [];
    const map = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
    return service.categories.map((slug) => map[slug]).filter(Boolean);
  }, [service, categories]);

  function handleAdd() {
    if (!service) return;
    add(service);
    toast.success(toastMessages.cartAdded);
  }

  if (loading) {
    return (
      <div className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 md:px-8 md:py-8">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-5 aspect-[4/3] w-full rounded-2xl sm:max-h-[420px]" />
          <Skeleton className="mt-6 h-9 w-3/4 max-w-sm" />
          <Skeleton className="mt-4 h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6 md:py-20">
        <p className="text-lg font-semibold text-ink">Session not found</p>
        <p className="mt-2 text-sm text-sub">This service may no longer be available.</p>
        <Button variant="accent" className="mt-8" onClick={() => navigate("/services")}>
          Browse all services
        </Button>
      </div>
    );
  }

  const imageSrc = getServiceImage(service);

  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 md:px-8 md:py-8">
        <Link
          to="/services"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-accent hover:text-[#0d6b63]"
        >
          <ArrowLeft size={18} />
          All services
        </Link>

        <div className="mt-5 flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border/70">
              <div className="aspect-[4/3] max-h-[min(56vw,320px)] sm:max-h-[420px] lg:aspect-[4/3] lg:max-h-none">
                <img
                  src={imageSrc}
                  alt={service.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="min-w-0">
            {categoryLabels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categoryLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-sub ring-1 ring-border/80"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:mt-4 sm:text-3xl">
              {service.name}
            </h1>

            <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-accent sm:mt-3">
              <Clock size={16} />
              {service.durationMin} minute session
            </p>

            <p className="mt-5 text-[15px] leading-relaxed text-sub sm:mt-6">
              {service.description ||
                "A focused at-home wellness session with a verified expert, designed for everyday relief."}
            </p>

            <ul className="mt-6 space-y-3 sm:mt-8">
              {INCLUDES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-ink">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <Icon size={16} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted lg:hidden">
              <Check size={14} className="mt-0.5 shrink-0 text-accent" />
              {brand.disclaimer}
            </p>

            {/* Mobile / tablet: in-page CTA (no fixed bar — avoids scroll jump) */}
            <div className="mt-6 rounded-2xl border border-border/80 bg-white p-4 sm:p-5 lg:hidden">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    Session price
                  </p>
                  <p className="mt-0.5 text-2xl font-semibold text-ink">
                    ₹{service.price?.toLocaleString("en-IN")}
                  </p>
                </div>
                <Button
                  variant="accent"
                  className="w-full min-h-12 gap-2 sm:w-auto sm:min-w-[180px]"
                  onClick={handleAdd}
                >
                  <Plus size={18} />
                  Add to cart
                </Button>
              </div>
            </div>

            {/* Desktop */}
            <div className="mt-8 hidden rounded-2xl border border-border/80 bg-white p-6 lg:block">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    Session price
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
                    ₹{service.price?.toLocaleString("en-IN")}
                  </p>
                </div>
                <Button variant="accent" className="min-h-12 gap-2 px-8" onClick={handleAdd}>
                  <Plus size={18} />
                  Add to cart
                </Button>
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
                <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                {brand.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
