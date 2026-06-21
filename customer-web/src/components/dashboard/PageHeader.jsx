import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function PageHeader({ title, subtitle, breadcrumbs, action }) {
  return (
    <header className="mb-8">
      {breadcrumbs?.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-sm text-muted">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight size={14} className="text-border" />}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-ink">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-sub">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-2 text-[15px] leading-7 text-sub">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
