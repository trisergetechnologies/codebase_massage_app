import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((message, type = "success", duration = 4000) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const value = useMemo(
    () => ({
      success: (msg) => push(msg, "success"),
      error: (msg) => push(msg, "error", 5000),
      loading: (msg) => push(msg, "loading", 0),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 left-4 right-4 z-[200] flex flex-col gap-2 sm:left-auto sm:right-6 sm:max-w-sm"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-md ${
              t.type === "error"
                ? "border-red-200 bg-white text-red-800"
                : t.type === "loading"
                  ? "border-border bg-white text-ink"
                  : "border-border bg-white text-ink"
            }`}
          >
            {t.type === "success" && <CheckCircle2 size={20} className="shrink-0 text-accent" />}
            {t.type === "error" && <AlertCircle size={20} className="shrink-0 text-red-600" />}
            {t.type === "loading" && (
              <Loader2 size={20} className="shrink-0 animate-spin text-accent" />
            )}
            <p className="flex-1 text-sm leading-6">{t.message}</p>
            <button
              type="button"
              className="shrink-0 text-muted"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast requires ToastProvider");
  return ctx;
}
