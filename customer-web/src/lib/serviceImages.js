/**
 * Curated wellness imagery keyed by service slug / name.
 * High-res Unsplash (wellness & massage), optimized for cards.
 */
const U = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const BY_SLUG = {
  "head-relief": U("photo-1515377905703-c4788e51af15"),
  "neck-relief": U("photo-1591343395082-e120087004b4"),
  "shoulder-relief": U("photo-1600334129128-685c5582fd35"),
  "neck-shoulder-relief": U("photo-1544161515-4ab6ce6db874"),
  "upper-back-relief": U("photo-1540555700478-4be289fbecef"),
  "arm-relaxation": U("photo-1519823551278-64ac92734fb1"),
  "back-relief": U("photo-1600334129128-685c5582fd35"),
  "lower-back-relief": U("photo-1544161515-4ab6ce6db874"),
  "posture-reset": U("photo-1571019614242-c5c5dee9f50e"),
  "leg-relief": U("photo-1519415510236-718bdfcd89c8"),
  "calf-relief": U("photo-1519415510236-718bdfcd89c8"),
  "foot-relief": U("photo-1519415510236-718bdfcd89c8"),
  "lower-body-recovery": U("photo-1519823551278-64ac92734fb1"),
  "stress-relief-session": U("photo-1540555700478-4be289fbecef"),
  "full-body-relaxation": U("photo-1544161515-4ab6ce6db874"),
};

const BY_NAME_KEYWORD = [
  ["head", BY_SLUG["head-relief"]],
  ["neck", BY_SLUG["neck-relief"]],
  ["shoulder", BY_SLUG["shoulder-relief"]],
  ["upper back", BY_SLUG["upper-back-relief"]],
  ["lower back", BY_SLUG["lower-back-relief"]],
  ["back", BY_SLUG["back-relief"]],
  ["arm", BY_SLUG["arm-relaxation"]],
  ["leg", BY_SLUG["leg-relief"]],
  ["calf", BY_SLUG["calf-relief"]],
  ["foot", BY_SLUG["foot-relief"]],
  ["posture", BY_SLUG["posture-reset"]],
  ["stress", BY_SLUG["stress-relief-session"]],
  ["full body", BY_SLUG["full-body-relaxation"]],
  ["recovery", BY_SLUG["lower-body-recovery"]],
  ["relaxation", BY_SLUG["stress-relief-session"]],
];

const DEFAULT_IMAGE = U("photo-1544161515-4ab6ce6db874");

export function getServiceImage(service) {
  if (!service) return DEFAULT_IMAGE;

  const slug = (service.slug || service.id || "").toLowerCase();
  if (slug && BY_SLUG[slug]) return BY_SLUG[slug];

  const name = (service.name || "").toLowerCase();
  for (const [keyword, url] of BY_NAME_KEYWORD) {
    if (name.includes(keyword)) return url;
  }

  if (service.imageUrl?.startsWith("http")) return service.imageUrl;

  return DEFAULT_IMAGE;
}
