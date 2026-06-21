import { ServiceBookingCard } from "./ServiceBookingCard";

export function FeaturedSessions({ services, onAdd }) {
  if (!services.length) return null;

  return (
    <section className="mt-12 sm:mt-14">
      <h2 className="text-sm font-semibold text-ink">Popular right now</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <ServiceBookingCard key={s.id} service={s} onAdd={onAdd} featured />
        ))}
      </div>
    </section>
  );
}
