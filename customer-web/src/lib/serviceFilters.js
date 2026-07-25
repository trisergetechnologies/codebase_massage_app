/** Popular sessions shown in featured row (by slug). */
export const POPULAR_SLUGS = [
  "neck-relief",
  "shoulder-relief",
  "back-relief",
  "stress-relief-session",
];

export const TRUST_ITEMS = [
  "Verified experts",
  "Transparent pricing",
  "Fast arrival",
  "Professional service",
];

export const FEELING_FILTERS = [
  {
    id: "neck-tension",
    label: "Neck tension",
    match: (s) => /neck/i.test(s.name),
  },
  {
    id: "shoulder-tightness",
    label: "Shoulder tightness",
    match: (s) => /shoulder/i.test(s.name),
  },
  {
    id: "back-fatigue",
    label: "Back fatigue",
    match: (s) => /back/i.test(s.name),
  },
  {
    id: "leg-fatigue",
    label: "Leg fatigue",
    match: (s) => /leg|calf|foot|lower body/i.test(s.name),
  },
  {
    id: "stress",
    label: "Stress",
    match: (s) => /stress|relaxation/i.test(s.name),
  },
  {
    id: "desk-job",
    label: "Desk job recovery",
    match: (s) =>
      /desk|posture|office|screen|upper back/i.test(`${s.name} ${s.description || ""}`),
  },
];

export const BODY_CATEGORIES = [
  { id: "all", label: "All", match: () => true },
  {
    id: "head",
    label: "Head",
    match: (s) => /^head relief/i.test(s.name) || s.slug === "head-relief",
  },
  {
    id: "neck",
    label: "Neck",
    match: (s) => /neck/i.test(s.name),
  },
  {
    id: "shoulder",
    label: "Shoulder",
    match: (s) => /shoulder/i.test(s.name),
  },
  {
    id: "back",
    label: "Back",
    match: (s) => /back/i.test(s.name),
  },
  {
    id: "legs",
    label: "Legs",
    match: (s) =>
      /leg|calf|foot/i.test(s.name) ||
      (s.categories || []).includes("lower-body"),
  },
  {
    id: "recovery",
    label: "Recovery",
    match: (s) =>
      /stress|posture|recovery|full body/i.test(s.name) ||
      (s.categories || []).includes("full-relaxation"),
  },
];

const BENEFIT_RULES = [
  { pattern: /screen|mental|fatigue/i, tag: "Screen fatigue" },
  { pattern: /desk|office|posture|sitting/i, tag: "Desk work" },
  { pattern: /stress|relaxation/i, tag: "Stress relief" },
  { pattern: /standing|walking|leg|calf|foot/i, tag: "Daily recovery" },
  { pattern: /shoulder|neck|back/i, tag: "Tension relief" },
];

export function getBenefitTags(service) {
  const text = `${service.name} ${service.description || ""}`;
  const tags = [];
  for (const { pattern, tag } of BENEFIT_RULES) {
    if (pattern.test(text) && !tags.includes(tag)) tags.push(tag);
  }
  if (tags.length === 0) tags.push("At-home relief");
  return tags.slice(0, 3);
}

export function filterServices(services, { bodyCategory, feelingId, query }) {
  const body = BODY_CATEGORIES.find((c) => c.id === bodyCategory) || BODY_CATEGORIES[0];
  const feeling = FEELING_FILTERS.find((f) => f.id === feelingId);
  const q = query.trim().toLowerCase();

  return services.filter((s) => {
    if (!body.match(s)) return false;
    if (feeling && !feeling.match(s)) return false;
    if (q) {
      const tags = getBenefitTags(s).join(" ").toLowerCase();
      const cats = (s.categories || []).join(" ").toLowerCase();
      const haystack = `${s.name || ""} ${s.description || ""} ${tags} ${cats}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function isPopularService(service) {
  const slug = service?.slug || service?.id;
  return POPULAR_SLUGS.includes(slug);
}

export function getPopularServices(services) {
  const bySlug = Object.fromEntries(services.map((s) => [s.slug || s.id, s]));
  return POPULAR_SLUGS.map((slug) => bySlug[slug]).filter(Boolean);
}
