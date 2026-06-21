import React from "react";
import { View, StyleSheet } from "react-native";
import { palette, radii, spacing } from "../theme/tokens";

export function Card({ children, style, accent }) {
  return (
    <View style={[styles.card, accent && styles.accent, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  accent: { borderColor: "rgba(74,210,149,0.35)" },
});
