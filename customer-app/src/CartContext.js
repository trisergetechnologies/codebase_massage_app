import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

/**
 * CartProvider — local-only cart state.
 *
 * Items carry a `quantity` so users can book the same service for multiple
 * people (e.g., a couples Swedish at 2x). Pricing & duration aggregate
 * across quantity, so a 2x 60-min Swedish costs 2 * price and totals 120 min.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{...service, quantity}]

  const value = useMemo(() => {
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
    const duration = items.reduce((s, it) => s + (it.durationMin || 0) * (it.quantity || 1), 0);
    const count = items.reduce((s, it) => s + (it.quantity || 1), 0);

    return {
      items,
      total,
      duration,
      count,

      add: (svc) =>
        setItems((prev) => {
          const found = prev.find((i) => i.id === svc.id);
          if (found) {
            return prev.map((i) => (i.id === svc.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
          }
          return [...prev, { ...svc, quantity: 1 }];
        }),

      increment: (id) =>
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i))),

      decrement: (id) =>
        setItems((prev) =>
          prev
            .map((i) => (i.id === id ? { ...i, quantity: (i.quantity || 1) - 1 } : i))
            .filter((i) => (i.quantity || 0) > 0)
        ),

      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),

      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
