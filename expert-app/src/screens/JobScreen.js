import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Linking, Alert } from "react-native";
import { LeafletView } from "react-native-leaflet-view";
import { api } from "../api";
import { getSocket } from "../socket";
import { useExpertSession } from "../context/ExpertSessionContext";
import { Screen, Text, Card, Button, StatusBadge, JourneyStepper } from "../ui";
import {
  formatRupee,
  getExpertJourneyIndex,
  getNextExpertAction,
  getStatusLabel,
} from "../utils/booking";
import { palette, spacing, radii } from "../theme/tokens";

export default function JobScreen({ route, navigation }) {
  const { bookingId } = route.params;
  const { refreshMe } = useExpertSession();
  const [booking, setBooking] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const b = await api.getBooking(bookingId);
    setBooking(b);
  }

  useEffect(() => {
    let mounted = true;
    let socket;
    (async () => {
      await load();
      socket = await getSocket();
      socket.emit("booking:subscribe", { bookingId });
      const reload = () => mounted && load();
      socket.on("booking:status", reload);
      socket.on("booking:addon", reload);
      socket.on("booking:arrived", reload);
    })();
    return () => {
      mounted = false;
      if (socket) {
        socket.off("booking:status");
        socket.off("booking:addon");
        socket.off("booking:arrived");
        socket.emit("booking:unsubscribe", { bookingId });
      }
    };
  }, [bookingId]);

  const journeyIndex = getExpertJourneyIndex(booking);
  const nextAction = getNextExpertAction(booking);

  const mapCenter = useMemo(() => {
    if (!booking?.location) return { lat: 12.9716, lng: 77.5946 };
    return { lat: booking.location.lat, lng: booking.location.lng };
  }, [booking]);

  const markers = useMemo(() => {
    if (!booking?.location) return [];
    return [
      {
        id: "customer",
        position: { lat: booking.location.lat, lng: booking.location.lng },
        icon: "📍",
        size: [36, 36],
      },
    ];
  }, [booking]);

  function openMaps() {
    if (!booking?.location) return;
    const { lat, lng } = booking.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url).catch(() => Alert.alert("Could not open maps"));
  }

  async function runAction() {
    if (!nextAction) return;
    setBusy(true);
    try {
      if (nextAction.step === "arrived") await api.arrived(bookingId);
      else if (nextAction.step === "start") await api.start(bookingId);
      else if (nextAction.step === "complete") {
        await api.complete(bookingId);
        await refreshMe();
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs", params: { screen: "Home" } }],
        });
        return;
      }
      await load();
      await refreshMe();
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!booking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={palette.accent} size="large" />
      </View>
    );
  }

  const statusLabel = getStatusLabel(booking.status, booking.timeline);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <StatusBadge status={booking.status} label={statusLabel} />
        {booking.quotedEtaMin != null && (
          <Text variant="caption">Quoted ETA {booking.quotedEtaMin} min</Text>
        )}
        {booking.distanceKm != null && (
          <Text variant="caption"> · {booking.distanceKm} km away</Text>
        )}
      </View>

      <Card>
        <Text variant="label">Customer</Text>
        <Text variant="subtitle" style={{ marginTop: spacing.xs }}>
          {booking.customer?.name || "Customer"}
        </Text>
        {booking.customer?.phone ? (
          <Text variant="caption">{booking.customer.phone}</Text>
        ) : null}
      </Card>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <View style={styles.mapWrap}>
          <LeafletView
            mapCenterPosition={mapCenter}
            zoom={15}
            mapMarkers={markers}
            doDebug={false}
          />
        </View>
        <View style={{ padding: spacing.lg }}>
          <Text variant="label">Pickup</Text>
          <Text variant="body" style={{ marginTop: spacing.xs }}>
            {booking.location.address ||
              `${booking.location.lat.toFixed(5)}, ${booking.location.lng.toFixed(5)}`}
          </Text>
          <Button
            title="Go to location"
            variant="ghost"
            onPress={openMaps}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </Card>

      <Card>
        <Text variant="label">Your progress</Text>
        <JourneyStepper activeIndex={journeyIndex} />
      </Card>

      <Card>
        <Text variant="label">Services</Text>
        {booking.items.map((it) => (
          <View key={it.id || it.name} style={styles.line}>
            <Text variant="body" style={{ flex: 1, color: it.isAddOn ? palette.accent : palette.text }}>
              {it.isAddOn ? "+ " : ""}
              {it.name}
            </Text>
            <Text variant="body">{formatRupee(it.price)}</Text>
          </View>
        ))}
        <View style={[styles.line, styles.totalLine]}>
          <Text variant="subtitle">Total</Text>
          <Text variant="accent">{formatRupee(booking.pricing?.total)}</Text>
        </View>
        <Text variant="caption" style={{ marginTop: spacing.sm }}>
          Add-ons from the customer appear here automatically during the session.
        </Text>
      </Card>

      {nextAction && (
        <Button title={nextAction.label} onPress={runAction} loading={busy} />
      )}

      {booking.status === "completed" && (
        <Button
          title="Back to home"
          variant="ghost"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "MainTabs", params: { screen: "Home" } }],
            })
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: palette.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  mapWrap: { height: 220, backgroundColor: palette.card2 },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  totalLine: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
});
