export function SettingsSection({ title, description, children }) {
  return (
    <section className="border-b border-border py-8 first:pt-0 last:border-0">
      <div className="grid gap-6 md:grid-cols-[minmax(0,220px)_1fr] md:gap-12">
        <div>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-sub">{description}</p>
          ) : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
