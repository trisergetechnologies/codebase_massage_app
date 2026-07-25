import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

export function FloatingCartBar() {
  const { totals, setOpen, isEmpty } = useCart();

  if (isEmpty) return null;

  const sessions =
    totals.count === 1 ? "1 session" : `${totals.count} sessions`;

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 animate-slide-up rounded-card bg-forest px-4 text-white shadow-xl md:hidden"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))", height: 60 }}
    >
      <div className="flex h-[60px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <ShoppingBag size={20} className="shrink-0" />
          <p className="truncate type-body font-semibold">
            {sessions} · ₹{totals.price.toLocaleString("en-IN")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-1 type-button-sm font-semibold text-white"
        >
          Book now <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
