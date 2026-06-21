import { Link } from "react-router-dom";
import { brand } from "../../content/brand";

const columns = [
  { title: "Company", links: ["About", "Careers"] },
  { title: "Support", links: ["Help center", "FAQs"] },
  { title: "Legal", links: ["Privacy", "Terms", "Contact"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-sm font-bold text-white">
                R
              </span>
              <span className="font-semibold text-ink">{brand.headlines.primary}</span>
            </div>
            <p className="mt-4 max-w-sm text-[15px] leading-7 text-muted">{brand.shortDescription}</p>
            <p className="mt-6 text-sm leading-6 text-muted">{brand.disclaimer}</p>
          </div>

          {columns.map((col) => (
            <FooterCol key={col.title} title={col.title} links={col.links} />
          ))}
        </div>

        <p className="mt-12 border-t border-border pt-8 text-sm text-muted">
          © {new Date().getFullYear()}. {brand.mission}
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l}>
            <Link to="/support" className="text-[15px] text-muted transition hover:text-ink">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
