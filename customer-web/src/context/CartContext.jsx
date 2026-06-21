import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadCart, saveCart } from "../lib/cartStorage";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart());
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(items);
  }, [items, hydrated]);

  const add = useCallback((service, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.service.id === service.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { service, quantity: qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((serviceId) => {
    setItems((prev) => prev.filter((i) => i.service.id !== serviceId));
  }, []);

  const setQuantity = useCallback((serviceId, quantity) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.service.id !== serviceId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.service.id === serviceId ? { ...i, quantity } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    let price = 0;
    let minutes = 0;
    let count = 0;
    for (const { service, quantity } of items) {
      price += (service.price || 0) * quantity;
      minutes += (service.durationMin || 0) * quantity;
      count += quantity;
    }
    return { price, minutes, count };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      open,
      setOpen,
      add,
      remove,
      setQuantity,
      clear,
      totals,
      isEmpty: items.length === 0,
    }),
    [items, open, add, remove, setQuantity, clear, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart requires CartProvider");
  return ctx;
}
