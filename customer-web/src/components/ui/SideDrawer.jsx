import { X } from "lucide-react";
import { Portal } from "./Portal";

/**
 * Full-viewport side drawer (portaled). Avoids sticky-header clipping on mobile.
 */
export function SideDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = "right",
  ariaLabel = "Panel",
  widthClass = "w-[min(100%,20rem)] sm:w-80",
}) {
  if (!open) return null;

  const position = side === "right" ? "right-0 border-l" : "left-0 border-r";

  return (
    <Portal>
      <button
        type="button"
        className="fixed inset-0 z-[190] bg-ink/55 backdrop-blur-[2px]"
        aria-label={`Close ${title || "panel"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 ${position} z-[200] flex ${widthClass} max-w-full flex-col border-border bg-white shadow-2xl`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4">
          <div className="text-lg font-semibold text-ink">{title}</div>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-surface text-muted hover:text-ink"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-border px-4 py-4">{footer}</div>
        ) : null}
      </aside>
    </Portal>
  );
}
