import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { palette, radii, layout, shadows } from "../theme/tokens";

/**
 * Card — surface container. Tone defaults to "surface" (white) but can flip
 * to "ink" (dark brand surface, used for hero blocks) or "soft" (chip-like).
 *
 * Pass `onPress` to make it a tappable surface with subtle press feedback.
 */
const TONES = {
  surface: palette.surface,
  soft: palette.surfaceSoft,
  warm: palette.surfaceWarm,
  ink: palette.ink,
  purple: palette.purple,
};

export default function Card({
  children,
  tone = "surface",
  padding = layout.cardPadding,
  radius = radii.xxl,
  elevation = "md",
  onPress,
  style,
}) {
  const bg = TONES[tone] || tone;
  const sty = [
    {
      backgroundColor: bg,
      padding,
      borderRadius: radius,
    },
    elevation && shadows[elevation],
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [sty, pressed && styles.pressed]}>
        {children}
      </Pressable>
    );
  }
  return <View style={sty}>{children}</View>;
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.92, transform: [{ scale: 0.997 }] },
});
