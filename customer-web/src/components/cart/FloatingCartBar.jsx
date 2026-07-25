import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

export function FloatingCartBar() {
  const { totals, setOpen, isEmpty } = useCart();

  if (isEmpty) return null;

  const sessions =
    totals.count === 1 ? "1 session" : `${totals.count} sessions`;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-white/95 px-4 py-3 shadow-[0_-8px_32px_rgba(15,20,25,0.08)] backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {label}
          </p>
          <p className="text-xs text-muted">Tap to review & book</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
        >
          View cart · ₹{totals.price.toLocaleString("en-IN")}
        </button>
      </div>
    </div>
  );
}
