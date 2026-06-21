import React from "react";
import { Pressable } from "react-native";
import { palette, radii, shadows } from "../theme/tokens";

/**
 * Round icon button used in headers (back, notifications, location etc.).
 * `tone="surface"` (default) is the cream-on-white softly elevated style.
 */
const TONES = {
  surface: { bg: palette.surface, ring: palette.hairline },
  soft:    { bg: palette.surfaceSoft, ring: "transparent" },
  ink:     { bg: palette.ink, ring: "transparent" },
  purple:  { bg: palette.purple, ring: "transparent" },
};

export default function IconButton({ children, onPress, size = 44, tone = "surface", elevated = false, style }) {
  const t = TONES[tone] || TONES.surface;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: t.bg,
          borderWidth: t.ring === "transparent" ? 0 : 1,
          borderColor: t.ring,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.85 : 1,
        },
        elevated && shadows.sm,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}
