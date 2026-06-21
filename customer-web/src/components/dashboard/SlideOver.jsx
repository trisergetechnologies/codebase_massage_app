import { X } from "lucide-react";

export function SlideOver({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[80] bg-ink/30"
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        className="fixed inset-y-0 right-0 z-[85] flex w-full max-w-md flex-col border-l border-border bg-white shadow-lg motion-safe:animate-fade-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="slideover-title"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="slideover-title" className="text-lg font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg border border-border text-muted hover:bg-surface"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </aside>
    </>
  );
}
