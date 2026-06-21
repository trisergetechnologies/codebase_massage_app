import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import { useExpertSession } from "../context/ExpertSessionContext";
import { Text, Button, Card } from "../ui";
import { formatRupee } from "../utils/booking";
import { palette, spacing, radii } from "../theme/tokens";

export function OfferModal() {
  const { offer, secLeft, respondToOffer } = useExpertSession();
  if (!offer) return null;

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text variant="label" style={{ color: palette.accent }}>
            New job offer
          </Text>
          <Text variant="title" style={{ marginTop: spacing.sm }}>
            {offer.etaMin} min away · {offer.distanceKm} km
          </Text>
          <Text variant="caption" style={{ marginTop: spacing.xs }}>
            Accept within {secLeft}s or it goes to the next expert.
          </Text>

          <Card style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
            <Text variant="label">Services</Text>
            {(offer.items || []).map((it, idx) => (
              <View key={idx} style={styles.row}>
                <Text variant="body" style={{ flex: 1 }}>
                  {it.name}
                </Text>
                <Text variant="caption">{it.durationMin} min</Text>
                <Text variant="body" style={{ marginLeft: spacing.sm, fontWeight: "700" }}>
                  {formatRupee(it.price)}
                </Text>
              </View>
            ))}
            <View style={[styles.row, styles.totalRow]}>
              <Text variant="subtitle">Total</Text>
              <Text variant="accent">{formatRupee(offer.total)}</Text>
            </View>
            {offer.pickupLocation?.address ? (
              <Text variant="caption" style={{ marginTop: spacing.md }}>
                {offer.pickupLocation.address}
              </Text>
            ) : (
              <Text variant="caption" style={{ marginTop: spacing.md }}>
                Pickup: {offer.pickupLocation?.lat?.toFixed(5)}, {offer.pickupLocation?.lng?.toFixed(5)}
              </Text>
            )}
          </Card>

          <View style={styles.actions}>
            <Button
              title="Decline"
              variant="ghost"
              onPress={() => respondToOffer(false)}
              style={{ flex: 1 }}
            />
            <Button
              title="Accept job"
              onPress={() => respondToOffer(true)}
              style={{ flex: 1.2 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: palette.card,
    borderTopLeftRadius: radii.lg + 4,
    borderTopRightRadius: radii.lg + 4,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: palette.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  totalRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
});
