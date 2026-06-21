import React from "react";
import { Text as RNText, StyleSheet } from "react-native";
import { type, palette } from "../theme/tokens";

/**
 * Wraps RN Text so every block of copy in the app gets typography from
 * `type` presets. Pass `variant` to switch (default = body).
 *
 * <T variant="h1">Welcome</T>
 * <T variant="caption" color="muted">3 SERVICES</T>
 */
const COLORS = {
  primary: palette.textPrimary,
  secondary: palette.textSecondary,
  muted: palette.textMuted,
  ink: palette.ink,
  purple: palette.purple,
  purpleDeep: palette.purpleDeep,
  gold: palette.gold,
  onInk: palette.textOnInk,
  onPurple: palette.textOnPurple,
  success: palette.success,
  danger: palette.danger,
};

export default function Text({
  variant = "body",
  color = "primary",
  style,
  children,
  numberOfLines,
  ...rest
}) {
  const preset = type[variant] || type.body;
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[preset, { color: COLORS[color] || color }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
