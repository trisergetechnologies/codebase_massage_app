/**
 * Seed script: populates service categories, relief-focused services, and
 * sample experts scattered around a city centre for the dispatcher.
 *
 * Usage: `npm run seed` (after `npm install`).
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Service = require("../models/Service");
const Expert = require("../models/Expert");
const User = require("../models/User");
const env = require("../config/env");
const geo = require("../services/geo");
const { backfillPublicIds } = require("../lib/backfillPublicIds");

const CATEGORIES = [
  {
    slug: "head-upper-body",
    name: "Head & Upper Body",
    description: "Relief for head, neck, shoulders, upper back, and arms.",
    sortOrder: 1,
  },
  {
    slug: "back-core",
    name: "Back & Core",
    description: "Sessions for back tightness, lower back discomfort, and desk posture fatigue.",
    sortOrder: 2,
  },
  {
    slug: "lower-body",
    name: "Lower Body",
    description: "Leg, calf, and foot relaxation for standing, walking, and daily fatigue.",
    sortOrder: 3,
  },
  {
    slug: "full-relaxation",
    name: "Full Relaxation",
    description: "Broad stress relief and full-body relaxation experiences.",
    sortOrder: 4,
  },
];

const SERVICES = [
  // — Head & Upper Body —
  {
    slug: "head-relief",
    name: "Head Relief",
    categories: ["head-upper-body"],
    skillTag: "head_upper_body",
    description: "General relaxation for mental fatigue and long screen hours.",
    durationMin: 30,
    price: 699,
    addOnEligible: true,
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600",
  },
  {
    slug: "neck-relief",
    name: "Neck Relief",
    categories: ["head-upper-body"],
    skillTag: "head_upper_body",
    description: "Focused on neck stiffness and discomfort.",
    durationMin: 30,
    price: 749,
    addOnEligible: true,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600",
  },
  {
    slug: "shoulder-relief",
    name: "Shoulder Relief",
    categories: ["head-upper-body"],
    skillTag: "head_upper_body",
    description: "For shoulder tension from work or daily activities.",
    durationMin: 30,
    price: 749,
    addOnEligible: true,
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600",
  },
  {
    slug: "neck-shoulder-relief",
    name: "Neck & Shoulder Relief",
    categories: ["head-upper-body"],
    skillTag: "head_upper_body",
    description: "Combined session for the most common office-worker pain points.",
    durationMin: 45,
    price: 999,
    addOnEligible: false,
    imageUrl: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600",
  },
  {
    slug: "upper-back-relief",
    name: "Upper Back Relief",
    categories: ["head-upper-body", "back-core"],
    skillTag: "head_upper_body",
    description: "Targets upper-back tightness.",
    durationMin: 45,
    price: 899,
    addOnEligible: true,
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
  },
  {
    slug: "arm-relaxation",
    name: "Arm Relaxation",
    categories: ["head-upper-body"],
    skillTag: "head_upper_body",
    description: "Focused arm and forearm relaxation.",
    durationMin: 30,
    price: 699,
    addOnEligible: true,
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600",
  },

  // — Back & Core —
  {
    slug: "back-relief",
    name: "Back Relief",
    categories: ["back-core"],
    skillTag: "back_core",
    description: "General back relaxation session.",
    durationMin: 45,
    price: 899,
    addOnEligible: false,
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600",
  },
  {
    slug: "lower-back-relief",
    name: "Lower Back Relief",
    categories: ["back-core"],
    skillTag: "back_core",
    description: "Focused on lower-back discomfort from sitting.",
    durationMin: 45,
    price: 949,
    addOnEligible: true,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600",
  },
  {
    slug: "posture-reset",
    name: "Posture Reset",
    categories: ["back-core", "head-upper-body"],
    skillTag: "back_core",
    description: "Relaxation session designed around desk-job fatigue.",
    durationMin: 60,
    price: 1199,
    addOnEligible: false,
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600",
  },

  // — Lower Body —
  {
    slug: "leg-relief",
    name: "Leg Relief",
    categories: ["lower-body"],
    skillTag: "lower_body",
    description: "Full leg relaxation session.",
    durationMin: 45,
    price: 899,
    addOnEligible: false,
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600",
  },
  {
    slug: "calf-relief",
    name: "Calf Relief",
    categories: ["lower-body"],
    skillTag: "lower_body",
    description: "Focused on calf tightness and fatigue.",
    durationMin: 30,
    price: 699,
    addOnEligible: true,
    imageUrl: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600",
  },
  {
    slug: "foot-relief",
    name: "Foot Relief",
    categories: ["lower-body"],
    skillTag: "lower_body",
    description: "Foot-focused relaxation session.",
    durationMin: 30,
    price: 699,
    addOnEligible: true,
    imageUrl: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600",
  },
  {
    slug: "lower-body-recovery",
    name: "Lower Body Recovery",
    categories: ["lower-body"],
    skillTag: "lower_body",
    description: "Legs, calves, and feet combined.",
    durationMin: 60,
    price: 1299,
    addOnEligible: false,
    imageUrl: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600",
  },

  // — Full Relaxation —
  {
    slug: "stress-relief-session",
    name: "Stress Relief Session",
    categories: ["full-relaxation"],
    skillTag: "full_relaxation",
    description: "General relaxation-focused experience.",
    durationMin: 60,
    price: 1399,
    addOnEligible: false,
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
  },
  {
    slug: "full-body-relaxation",
    name: "Full Body Relaxation",
    categories: ["full-relaxation", "head-upper-body", "back-core", "lower-body"],
    skillTag: "full_relaxation",
    description: "Broad relaxation session covering major muscle groups.",
    durationMin: 90,
    price: 1999,
    addOnEligible: false,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600",
  },
];

// Centred near Bengaluru / Indiranagar — change freely.
const CENTRE = { lat: 12.9716, lng: 77.6411 };

const EXPERTS = [
  {
    phone: "+919000000001",
    name: "Aarav K.",
    skills: ["head_upper_body", "back_core", "full_relaxation"],
    offsetKm: { dx: 0.4, dy: 0.2 },
    rating: 4.8,
  },
  {
    phone: "+919000000002",
    name: "Meera P.",
    skills: ["head_upper_body", "lower_body", "full_relaxation"],
    offsetKm: { dx: -0.6, dy: 0.5 },
    rating: 4.9,
  },
  {
    phone: "+919000000003",
    name: "Rohan S.",
    skills: ["back_core", "head_upper_body"],
    offsetKm: { dx: 1.2, dy: -0.3 },
    rating: 4.6,
  },
  {
    phone: "+919000000004",
    name: "Ishita V.",
    skills: ["lower_body", "full_relaxation"],
    offsetKm: { dx: -0.2, dy: -0.8 },
    rating: 4.7,
  },
  {
    phone: "+919000000005",
    name: "Kabir J.",
    skills: ["head_upper_body", "back_core", "lower_body", "full_relaxation"],
    offsetKm: { dx: 0.1, dy: 0.1 },
    rating: 5.0,
  },
];

// 1 deg lat ~ 110.574 km; 1 deg lng ~ 111.320 * cos(lat) km.
function offset({ lat, lng }, dxKm, dyKm) {
  return {
    lat: lat + dyKm / 110.574,
    lng: lng + dxKm / (111.32 * Math.cos((lat * Math.PI) / 180)),
  };
}

async function run() {
  await mongoose.connect(env.MONGO_URI);
  console.log("[seed] connected");

  await Category.deleteMany({});
  await Category.insertMany(CATEGORIES);
  console.log(`[seed] inserted ${CATEGORIES.length} categories`);

  await Service.deleteMany({});
  await Service.insertMany(SERVICES);
  console.log(`[seed] inserted ${SERVICES.length} services`);

  await Expert.deleteMany({});
  for (const e of EXPERTS) {
    const loc = offset(CENTRE, e.offsetKm.dx, e.offsetKm.dy);
    await Expert.create({
      phone: e.phone,
      name: e.name,
      skills: e.skills,
      rating: e.rating,
      status: "offline",
      lastLocation: { lat: loc.lat, lng: loc.lng, updatedAt: new Date() },
      h3Index: geo.toCell(loc.lat, loc.lng),
    });
  }
  console.log(`[seed] inserted ${EXPERTS.length} experts (offline near ${CENTRE.lat},${CENTRE.lng} — go online in the app)`);

  await backfillPublicIds([User, Expert]);
  console.log("[seed] publicId backfill complete");

  await mongoose.disconnect();
  console.log("[seed] done");
}

run().catch((err) => {
  console.error("[seed]", err);
  process.exit(1);
});
