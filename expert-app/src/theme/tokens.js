/** Operational driver-app palette (Uber / Rapido style) */
export const colors = {
  bg: "#F4F5F7",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F1F3",
  border: "#E2E5EA",
  text: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  primary: "#111827",
  primaryBtn: "#111827",
  primaryBtnText: "#FFFFFF",
  accent: "#2563EB",
  success: "#059669",
  successBg: "#D1FAE5",
  warn: "#D97706",
  warnBg: "#FEF3C7",
  danger: "#DC2626",
  dangerBg: "#FEE2E2",
  online: "#059669",
  offline: "#6B7280",
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };
export const radii = { sm: 6, md: 10, lg: 12, xl: 16, pill: 999 };
export const font = {
  regular: "PlusJakartaSans_400Regular",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
};

/** @deprecated use colors */
export const palette = {
  bg: colors.bg,
  card: colors.surface,
  card2: colors.surfaceAlt,
  border: colors.border,
  text: colors.text,
  muted: colors.textSecondary,
  accent: colors.accent,
  accent2: colors.accent,
  warn: colors.warn,
  danger: colors.danger,
};
