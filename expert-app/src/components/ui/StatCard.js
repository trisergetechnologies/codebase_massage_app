import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, spacing, radii } from "../../theme/tokens";
import { AppText } from "./AppText";

export function StatCard({ label, value, sub }) {
  return (
    <View style={styles.card}>
      <AppText variant="label">{label}</AppText>
      <AppText variant="h2" style={styles.value}>
        {value}
      </AppText>
      {sub ? (
        <AppText variant="caption" color="secondary">
          {sub}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: { marginTop: spacing.xs },
});
