import { Minus, Plus, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/Button";
import { Portal } from "../ui/Portal";

export function CartDrawer({ onProceed }) {
  const { items, open, setOpen, setQuantity, remove, totals, isEmpty } = useCart();

  if (!open) return null;

  return (
    <Portal>
      <button
        type="button"
        className="fixed inset-0 z-[190] bg-ink/40"
        aria-label="Close cart"
        onClick={() => setOpen(false)}
      />
      <aside
        className="fixed inset-y-0 right-0 z-[200] flex w-full max-w-[420px] flex-col border-l border-border bg-white shadow-2xl"
        aria-label="Your booking"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Your booking</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">
              {totals.count} session{totals.count === 1 ? "" : "s"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-10 place-items-center rounded-full bg-surface text-muted hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
          {isEmpty ? (
            <p className="py-16 text-center text-sm text-sub">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map(({ service, quantity }) => (
                <li key={service.id} className="py-4 first:pt-0">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium text-ink">{service.name}</h3>
                      <p className="mt-1 text-sm text-muted">{service.durationMin} min</p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 text-xs font-medium text-muted hover:text-ink"
                      onClick={() => remove(service.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-border bg-[#fafafa]">
                      <button
                        type="button"
                        className="grid size-9 place-items-center text-ink hover:bg-white"
                        onClick={() => setQuantity(service.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        className="grid size-9 place-items-center text-ink hover:bg-white"
                        onClick={() => setQuantity(service.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-ink">
                      ₹{((service.price || 0) * quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <div className="border-t border-border bg-[#fafafa] px-6 py-5">
            <div className="flex justify-between text-sm text-sub">
              <span>Total duration</span>
              <span className="font-medium text-ink">{totals.minutes} min</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border/80 pt-3">
              <span className="font-medium text-ink">Total</span>
              <span className="text-xl font-semibold text-ink">
                ₹{totals.price.toLocaleString("en-IN")}
              </span>
            </div>
            <Button
              variant="accent"
              className="mt-5 w-full min-h-12 text-base"
              onClick={() => {
                setOpen(false);
                onProceed?.();
              }}
            >
              Continue booking
            </Button>
          </div>
        )}
      </aside>
    </Portal>
  );
}
