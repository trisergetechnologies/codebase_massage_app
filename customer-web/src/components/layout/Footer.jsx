import { Link } from "react-router-dom";
import { brand } from "../../content/brand";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about-us" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", to: "/support" },
      { label: "FAQs", to: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/support" },
      { label: "Terms", to: "/support" },
      { label: "Contact", to: "/support" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-forest text-white">
      <div className="container-premium py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-white text-sm font-bold text-forest shadow-sm">
                R
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                {brand.headlines.primary}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/65">
              {brand.shortDescription}
            </p>
            <p className="mt-6 text-sm leading-6 text-white/45">{brand.disclaimer}</p>
          </div>

          {columns.map((col) => (
            <FooterCol key={col.title} title={col.title} links={col.links} />
          ))}
        </div>

        <div className="divider-fade mt-14 opacity-30" />
        <p className="mt-8 text-sm text-white/45">
          © {new Date().getFullYear()} Relief, Delivered. {brand.mission}
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-[15px] text-white/70 transition hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
