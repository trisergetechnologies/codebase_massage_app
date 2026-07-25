import { useEffect, useState } from "react";
import { Chip } from "../ui/Chip";

export function LiveTrackingMockup() {
  const [eta, setEta] = useState(8);

  useEffect(() => {
    const id = setInterval(() => {
      setEta((n) => (n <= 6 ? 8 : n - 1));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="hero-card-dark w-full max-w-[320px] p-5 text-white md:max-w-none"
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 type-body-sm text-forest-200">
          <span className="size-2 animate-pulse-live rounded-full bg-success" />
          Expert assigned
        </div>
        <Chip variant="live" pulse className="!bg-success/20 !text-success">
          Live
        </Chip>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-white/10 text-sm font-semibold">
          RK
        </span>
        <div>
          <p className="font-semibold">Ravi Kumar</p>
          <p className="type-caption text-forest-200">★ 4.8 · Head & Shoulder Relief</p>
        </div>
      </div>

      <p className="mt-5 type-body text-forest-200">
        🕐 {eta} min away · 2.3 km
      </p>

      <div className="mt-4">
        <p className="type-caption text-forest-200">Session starts soon</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-brand transition-all duration-slow ease-out"
            style={{ width: `${((8 - eta) / 2 + 0.65) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
