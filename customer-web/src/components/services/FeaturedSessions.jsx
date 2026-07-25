/**
 * Featured row removed from Services page in favour of a single image grid
 * with Popular badges. Kept as a thin wrapper for any future reuse.
 */
import { ServiceBookingCard } from "./ServiceBookingCard";

export function FeaturedSessions({ services, onAdd }) {
  if (!services?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {services.map((s) => (
        <ServiceBookingCard key={s.id} service={s} onAdd={onAdd} />
      ))}
    </div>
  );
}
