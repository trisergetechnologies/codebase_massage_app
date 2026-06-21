import { useCart } from "../../context/CartContext";

export function FloatingCartBar() {
  const { totals, setOpen, isEmpty } = useCart();

  if (isEmpty) return null;

  const label =
    totals.count === 1 ? "1 session selected" : `${totals.count} sessions selected`;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">
            {label} · ₹{totals.price.toLocaleString("en-IN")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d6b63] active:scale-[0.98]"
        >
          View cart
        </button>
      </div>
    </div>
  );
}
