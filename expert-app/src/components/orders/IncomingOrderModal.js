import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useExpertSession } from "../../context/ExpertSessionContext";
import { colors, spacing, radii } from "../../theme/tokens";
import { AppText } from "../ui/AppText";
import { PrimaryButton } from "../ui/PrimaryButton";
import { formatRupee } from "../../utils/order";

export function IncomingOrderModal() {
  const { offer, secLeft, respondToOffer } = useExpertSession();
  if (!offer) return null;

  const address =
    offer.pickupLocation?.address ||
    `${offer.pickupLocation?.lat?.toFixed(4)}, ${offer.pickupLocation?.lng?.toFixed(4)}`;

  return (
    <Modal visible animationType="slide" presentationStyle="fullScreen">
      <View style={styles.screen}>
        <View style={styles.timerRing}>
          <AppText variant="h1" style={styles.timer}>
            {secLeft}
          </AppText>
          <AppText variant="caption" color="secondary">
            sec left
          </AppText>
        </View>

        <AppText variant="label" style={styles.section}>
          New order
        </AppText>
        <AppText variant="h1">{offer.customerName || "Customer"}</AppText>
        <AppText variant="body" color="secondary" style={{ marginTop: spacing.xs }}>
          {offer.serviceName || offer.items?.[0]?.name || "Service"}
          {offer.durationMin ? ` · ${offer.durationMin} min` : ""}
        </AppText>

        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Feather name="navigation" size={18} color={colors.text} />
            <AppText variant="body" style={{ marginLeft: spacing.sm }}>
              {offer.distanceKm} km · ETA {offer.etaMin} min
            </AppText>
          </View>
        </View>

        <View style={styles.addressBox}>
          <Feather name="map-pin" size={18} color={colors.textSecondary} />
          <AppText variant="body" style={{ flex: 1, marginLeft: spacing.sm }}>
            {address}
          </AppText>
        </View>

        <View style={styles.totalRow}>
          <AppText variant="h3">You'll earn</AppText>
          <AppText variant="h2">
            {formatRupee(offer.estimatedEarning ?? offer.total)}
          </AppText>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Decline"
            variant="outline"
            onPress={() => respondToOffer(false)}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            title="Accept"
            onPress={() => respondToOffer(true)}
            style={{ flex: 1.3 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    paddingTop: 56,
    justifyContent: "center",
  },
  timerRing: {
    alignSelf: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.accent,
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  timer: { fontSize: 36, color: colors.accent },
  section: { marginBottom: spacing.sm },
  metaRow: { marginTop: spacing.lg },
  meta: { flexDirection: "row", alignItems: "center" },
  addressBox: {
    flexDirection: "row",
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xxl },
});
