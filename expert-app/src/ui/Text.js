import React from "react";
import { Text as RNText, StyleSheet } from "react-native";
import { palette } from "../theme/tokens";

export function Text({ variant = "body", style, children, ...rest }) {
  return (
    <RNText style={[styles[variant], style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  title: { color: palette.text, fontSize: 22, fontWeight: "700" },
  subtitle: { color: palette.text, fontSize: 17, fontWeight: "600" },
  body: { color: palette.text, fontSize: 15, lineHeight: 22 },
  caption: { color: palette.muted, fontSize: 13, lineHeight: 18 },
  label: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  accent: { color: palette.accent, fontSize: 15, fontWeight: "700" },
});
