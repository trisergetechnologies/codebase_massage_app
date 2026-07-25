import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { bookingService } from "../services/bookingService";
import { colors, spacing, radii } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { LoadingView } from "../components/feedback/LoadingView";
import {
  formatRupee,
  formatWhen,
  orderStatusLabel,
  serviceSummary,
  totalDurationMin,
} from "../utils/order";

function expertEarning(booking) {
  return (
    booking?.expertEarning ||
    Math.round((booking?.pricing?.subtotal || 0) * 0.7)
  );
}

export default function OrderDetailScreen({ route }) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    bookingService.get(bookingId).then(setBooking);
  }, [bookingId]);

  if (!booking) return <LoadingView message="Loading order…" />;

  const isDone = booking.status === "completed";
  const status = orderStatusLabel(booking.status, booking.timeline);

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.scroll}>
      <View style={styles.badge}>
        <AppText variant="caption" style={styles.badgeText}>
          {status}
        </AppText>
      </View>

      <AppText variant="h1">{booking.customer?.name || "Customer"}</AppText>
      <AppText variant="body" color="secondary">
        {formatWhen(booking.createdAt)}
      </AppText>

      <View style={styles.card}>
        <AppText variant="label">Services</AppText>
        <AppText variant="body" style={{ marginTop: spacing.xs }}>
          {serviceSummary(booking.items)} · {totalDurationMin(booking.items)} min
        </AppText>
      </View>

      {booking.location?.address && (
        <View style={styles.card}>
          <Feather name="map-pin" size={16} color={colors.textSecondary} />
          <AppText variant="body" style={{ marginTop: spacing.xs }}>
            {booking.location.address}
          </AppText>
        </View>
      )}

      {isDone && (
        <View style={styles.earnCard}>
          <AppText variant="label">You earned</AppText>
          <AppText variant="h1">{formatRupee(expertEarning(booking))}</AppText>
        </View>
      )}

      {booking.status === "cancelled" && booking.cancelReason && (
        <View style={styles.card}>
          <AppText variant="label">Cancellation reason</AppText>
          <AppText variant="body" color="secondary" style={{ marginTop: spacing.xs }}>
            {booking.cancelReason}
          </AppText>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginBottom: spacing.md,
  },
  badgeText: { fontWeight: "600" },
  card: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  earnCard: {
    marginTop: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
});
