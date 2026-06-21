import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { brand } from "../../content/brand";

export function LandingStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
      role="region"
      aria-label="Quick booking"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{brand.headlines.secondary}</p>
          <p className="truncate text-xs text-muted">At-home · Verified experts</p>
        </div>
        <Link
          to="/services"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white"
        >
          Book
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
