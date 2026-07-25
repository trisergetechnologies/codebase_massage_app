import { useEffect } from "react";
import { Portal } from "./Portal";
import { OverlayBackdrop } from "./OverlayBackdrop";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  snap = "75%",
  className = "",
}) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <OverlayBackdrop onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "sheet-title" : undefined}
        className={`fixed inset-x-0 bottom-0 z-[60] flex max-h-[92vh] flex-col rounded-t-modal bg-surface shadow-xl animate-slide-up md:inset-x-auto md:left-1/2 md:max-w-lg md:-translate-x-1/2 ${className}`}
        style={{ maxHeight: snap }}
      >
        <div className="flex shrink-0 flex-col items-center pt-2" aria-hidden>
          <div className="h-1 w-9 rounded-sm bg-slate-200" />
        </div>
        {title ? (
          <h2 id="sheet-title" className="type-h2 shrink-0 px-5 pb-3 pt-2 text-ink">
            {title}
          </h2>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer ? (
          <div className="shrink-0 border-t border-border px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </div>
    </Portal>
  );
}
