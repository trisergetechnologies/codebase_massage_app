/**
 * Design tokens — single source of truth for the entire customer app.
 *
 * Palette: "Mocha Cream" — soft warm-cream canvas, white cards with gentle
 * lift, deep coffee brown as the brand CTA, gold for stars, soft pastels
 * for the small category icon tiles. Premium and editorial.
 *
 * Inspiration: salon / beauty premium reference — clean, restrained, warm.
 */

export const palette = {
  // Surfaces
  bg: "#FFFFFF",           // pure white canvas — premium minimal
  bgTint: "#FAF3E8",       // ultra-soft warm tint for search pill / quiet zones
  surface: "#FFFFFF",      // cards (same as bg — differentiated by shadow + radius)
  surfaceSoft: "#FBF5EA",  // gentle off-white for nested surfaces / pressed states
  surfaceWarm: "#F4E7D5",  // peach-cream — for image backdrops & hero photo zones
  hairline: "#EDE2CF",     // visible warm hairline on white
  hairlineSoft: "#F4EAD8", // quietest border, used inside cards
  overlay: "rgba(40, 22, 12, 0.5)", // modal scrims, mocha-tinted

  // Brand — deep coffee brown is PRIMARY
  brand: "#5C2E1F",        // deep mocha — primary CTA, active states
  brandPressed: "#3F1F14",
  brandSoft: "#F2E2D8",    // gentle brand-tinted surfaces
  brandDeep: "#2E160E",    // for deepest dark surfaces (hero overlays)

  // Aliases — `ink` keeps existing references working but maps to brand.
  ink: "#5C2E1F",
  inkPressed: "#3F1F14",
  inkSoft: "#7A4030",

  // Selected state — soft cream-peach (the "All" pill)
  peach: "#E5C9AD",
  peachDeep: "#B0855A",
  peachSoft: "#F2E2D0",

  // Promotional accent — dusty purple (kept for promo banner)
  purple: "#7B6B8C",
  purpleDeep: "#5C4D6E",
  purpleSoft: "#DDD0E8",

  // Gold — used for ratings (and rare highlights)
  gold: "#F5A623",         // ratings (warmer/orange to fit the palette)
  goldSoft: "#FCE6C5",
  goldDeep: "#A66B0F",

  // Heart / favorite
  heart: "#E55A4A",
  heartSoft: "#FBE0DC",

  // Pastel category-icon tints
  catBlush:   { bg: "#FBE0DC", fg: "#B53A2C" },
  catOlive:   { bg: "#E8E5D2", fg: "#7A6E3F" },
  catSky:     { bg: "#DDE7F0", fg: "#3F5E7A" },
  catLilac:   { bg: "#E5DDEC", fg: "#5C4D6E" },
  catSand:    { bg: "#F2E2D0", fg: "#8A5A2B" },

  // Text
  textPrimary: "#2A1A12",
  textSecondary: "#7A6253",
  textMuted: "#A89684",
  textOnInk: "#F5EBDD",   // i.e. text on brown
  textOnBrand: "#F5EBDD",
  textOnPurple: "#FFFFFF",
  textOnPeach: "#2A1A12",

  // States
  success: "#5C8A6A",
  successSoft: "#DEEAD8",
  warn: "#C68A2C",
  danger: "#C3402F",
  dangerSoft: "#F4DCDC",

  // Status palette (StatusBadge)
  status: {
    created:     { bg: "#E5DDEC", fg: "#5C4D6E" },
    searching:   { bg: "#E5DDEC", fg: "#5C4D6E" },
    assigned:    { bg: "#F2E2D0", fg: "#8A5A2B" },
    in_progress: { bg: "#F2E2D0", fg: "#8A5A2B" },
    completed:   { bg: "#DEEAD8", fg: "#3F6C4D" },
    cancelled:   { bg: "#F4DCDC", fg: "#7E2F2F" },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  pill: 999,
};

export const fonts = {
  regular:    "PlusJakartaSans_400Regular",
  medium:     "PlusJakartaSans_500Medium",
  semibold:   "PlusJakartaSans_600SemiBold",
  bold:       "PlusJakartaSans_700Bold",
  extrabold:  "PlusJakartaSans_800ExtraBold",
};

export const type = {
  display:  { fontFamily: fonts.extrabold, fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
  h1:       { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, letterSpacing: -0.4 },
  h2:       { fontFamily: fonts.bold,      fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  h3:       { fontFamily: fonts.semibold,  fontSize: 16, lineHeight: 22 },
  body:     { fontFamily: fonts.regular,   fontSize: 15, lineHeight: 22 },
  bodyMd:   { fontFamily: fonts.medium,    fontSize: 15, lineHeight: 22 },
  bodySm:   { fontFamily: fonts.regular,   fontSize: 13, lineHeight: 18 },
  bodySmMd: { fontFamily: fonts.medium,    fontSize: 13, lineHeight: 18 },
  caption:  { fontFamily: fonts.semibold,  fontSize: 11, lineHeight: 14, letterSpacing: 0.6, textTransform: "uppercase" },
  button:   { fontFamily: fonts.bold,      fontSize: 15, lineHeight: 18, letterSpacing: 0.1 },
  price:    { fontFamily: fonts.extrabold, fontSize: 16, lineHeight: 20, letterSpacing: -0.2 },
  priceLg:  { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 28, letterSpacing: -0.4 },
  promoHero:{ fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 26, letterSpacing: -0.3 },
};

/**
 * Shadows tuned for modern Zepto/Zomato feel — diffuse soft glows, not
 * hard bottom lines. Always low opacity + generous radius. White cards on
 * white bg get their "card-ness" from radius + content, not from heavy
 * elevation.
 */
export const shadows = {
  sm: {
    shadowColor: "#2A1A12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  md: {
    shadowColor: "#2A1A12",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
  },
  lg: {
    shadowColor: "#2A1A12",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 36,
    elevation: 10,
  },
  // Bottom nav is FLAT — only a top hairline, no shadow blob.
  nav: {
    shadowColor: "#2A1A12",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 6,
  },
};

export const layout = {
  screenPadding: 22,
  cardPadding: 16,
  // Flat bottom-nav bar (no floating inset).
  bottomNavHeight: 64,
  bottomNavInset: 0,
  scrollBottomGuard: 96,
  hitSlop: { top: 8, right: 8, bottom: 8, left: 8 },
};

export const navTheme = {
  dark: false,
  colors: {
    background: palette.bg,
    card: palette.bg,
    text: palette.textPrimary,
    border: "transparent",
    primary: palette.brand,
    notification: palette.brand,
  },
};
