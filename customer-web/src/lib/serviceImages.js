/** Prefer API imageUrl; fall back by slug when empty. */
const SLUG_FALLBACKS = {
  "head-relief":
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
  "neck-relief":
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
  "shoulder-relief":
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
  "neck-shoulder-relief":
    "https://images.unsplash.com/photo-1591343395082-e120087004b4?auto=format&fit=crop&w=600&q=80",
  "upper-back-relief":
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
  "arm-relaxation":
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
  "back-relief":
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
  "lower-back-relief":
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
  "posture-reset":
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
  "leg-relief":
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
  "calf-relief":
    "https://images.unsplash.com/photo-1591343395082-e120087004b4?auto=format&fit=crop&w=600&q=80",
  "foot-relief":
    "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=600&q=80",
  "lower-body-recovery":
    "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=600&q=80",
  "stress-relief-session":
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
  "full-body-relaxation":
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80";

export function getServiceImage(service) {
  if (service?.imageUrl) return service.imageUrl;
  const slug = service?.slug || service?.id;
  return SLUG_FALLBACKS[slug] || DEFAULT_IMAGE;
}
