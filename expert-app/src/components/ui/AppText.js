import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors, font } from "../../theme/tokens";

export function AppText({ variant = "body", color, style, children, ...rest }) {
  const c = color === "secondary" ? colors.textSecondary : color === "muted" ? colors.textMuted : colors.text;
  return (
    <Text style={[styles[variant], { color: c }, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: font.bold, fontSize: 24, fontWeight: "700" },
  h2: { fontFamily: font.bold, fontSize: 20, fontWeight: "700" },
  h3: { fontFamily: font.semibold, fontSize: 17, fontWeight: "600" },
  body: { fontFamily: font.regular, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: font.regular, fontSize: 13, lineHeight: 18 },
  label: {
    fontFamily: font.semibold,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: colors.textSecondary,
  },
});
