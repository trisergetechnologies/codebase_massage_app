import { Portal } from "./Portal";

export function OverlayBackdrop({ onClose, label = "Close", zClass = "z-[190]" }) {
  return (
    <Portal>
      <button
        type="button"
        className={`fixed inset-0 ${zClass} bg-ink/55 backdrop-blur-[2px]`}
        aria-label={label}
        onClick={onClose}
      />
    </Portal>
  );
}
