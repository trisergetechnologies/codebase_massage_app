import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { palette, radii, spacing } from "../theme/tokens";

const COLORS = {
  offline: { bg: "rgba(139,148,167,0.12)", fg: palette.muted },
  online: { bg: "rgba(74,210,149,0.15)", fg: palette.accent },
  on_job: { bg: "rgba(245,166,35,0.15)", fg: palette.warn },
  assigned: { bg: "rgba(124,92,255,0.15)", fg: palette.accent2 },
  in_progress: { bg: "rgba(74,210,149,0.15)", fg: palette.accent },
  completed: { bg: "rgba(139,148,167,0.12)", fg: palette.muted },
  cancelled: { bg: "rgba(239,68,82,0.12)", fg: palette.danger },
};

export function StatusBadge({ status, label }) {
  const c = COLORS[status] || COLORS.offline;
  return (
    <View style={[styles.wrap, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{label || status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  text: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
});
