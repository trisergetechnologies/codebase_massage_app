import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { colors, spacing, radii } from "../../theme/tokens";
import { AppText } from "../ui/AppText";
import { formatRupee, formatWhen, orderStatusLabel, serviceSummary } from "../../utils/order";

export function OrderCard({ order, onPress }) {
  const status = orderStatusLabel(order.status, order.timeline);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <AppText variant="h3">{order.customer?.name || "Customer"}</AppText>
        <View style={styles.badge}>
          <AppText variant="caption" style={styles.badgeText}>
            {status}
          </AppText>
        </View>
      </View>
      <AppText variant="body" color="secondary" style={{ marginTop: spacing.xs }}>
        {serviceSummary(order.items)}
      </AppText>
      <View style={[styles.row, { marginTop: spacing.sm }]}>
        <AppText variant="caption" color="muted">
          {formatWhen(order.createdAt)}
        </AppText>
        <AppText variant="h3">{formatRupee(order.pricing?.total)}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.92 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  badgeText: { fontWeight: "600", fontSize: 11 },
});
