import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import { brand } from "../content/brand";

export function SupportPage({ embedded }) {
  if (!embedded) {
    return (
      <div className="bg-white">
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-8">
            <h1 className="text-3xl font-semibold text-ink">Support</h1>
            <p className="mt-3 text-lg text-sub">We&apos;re here to help you book with confidence.</p>
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-8 md:py-16">
          <SupportContent showBrowse />
        </div>
      </div>
    );
  }

  return <SupportContent />;
}

function SupportContent({ showBrowse }) {
  return (
    <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8 lg:space-y-0">
      <a
        href="mailto:support@relief.local"
        className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm lg:col-span-2"
      >
        <span className="grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
          <Mail size={22} />
        </span>
        <div>
          <p className="font-semibold text-ink">Email us</p>
          <p className="text-sm text-sub">support@relief.local</p>
        </div>
      </a>

      <div className="rounded-2xl border border-border bg-white p-4 lg:col-span-1 lg:p-6">
        <div className="flex items-center gap-2 text-ink font-semibold">
          <MessageCircle size={18} className="text-accent" />
          Common questions
        </div>
        <div className="mt-4 divide-y divide-border">
          {brand.faq.map((item) => (
            <details key={item.q} className="py-4 first:pt-2">
              <summary className="cursor-pointer text-sm font-medium text-ink list-none">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-6 text-sub">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {showBrowse && (
        <Link
          to="/services"
          className="block w-full rounded-2xl bg-accent py-3.5 text-center text-sm font-semibold text-white lg:col-span-2"
        >
          Browse services
        </Link>
      )}
    </div>
  );
}
