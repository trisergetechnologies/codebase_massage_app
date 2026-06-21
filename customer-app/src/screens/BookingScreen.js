import React, { useEffect, useMemo, useState } from "react";
import {
  View, Pressable, Alert, Modal, ActivityIndicator, ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LeafletView } from "react-native-leaflet-view";

import {
  Screen, Text, Button, Card, IconButton, StatusBadge, Avatar, Divider, Chip,
} from "../ui";
import { palette, spacing, radii, shadows, layout } from "../theme/tokens";
import { api } from "../api";
import { getSocket } from "../socket";

const STAGES = [
  { key: "searching",   label: "Finding expert",     icon: "search" },
  { key: "assigned",    label: "On the way",         icon: "navigation" },
  { key: "in_progress", label: "Service in progress",icon: "activity" },
  { key: "completed",   label: "Completed",          icon: "check-circle" },
];

export default function BookingScreen({ route, navigation }) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [expertLoc, setExpertLoc] = useState(null);
  const [logs, setLogs] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addOnable, setAddOnable] = useState([]);

  function pushLog(msg) {
    setLogs((prev) => [{ at: Date.now(), msg }, ...prev].slice(0, 12));
  }

  useEffect(() => {
    let mounted = true;
    let socket;

    async function init() {
      const b = await api.getBooking(bookingId);
      if (!mounted) return;
      setBooking(b);
      if (b.expert?.lastLocation?.lat) setExpertLoc(b.expert.lastLocation);

      socket = await getSocket();
      socket.emit("booking:subscribe", { bookingId });

      socket.on("booking:status", ({ status }) => {
        pushLog(`status → ${status}`);
        api.getBooking(bookingId).then((fresh) => mounted && setBooking(fresh));
      });
      socket.on("booking:assigned", (data) => {
        pushLog(`${data.expert?.name} accepted · ETA ${data.quotedEtaMin} min`);
        if (data.expert?.location) setExpertLoc(data.expert.location);
        api.getBooking(bookingId).then((fresh) => mounted && setBooking(fresh));
      });
      socket.on("booking:expert_location", ({ lat, lng }) => setExpertLoc({ lat, lng }));
      socket.on("booking:arrived", () => pushLog("therapist arrived"));
      socket.on("booking:addon", ({ pricing }) => {
        pushLog(`add-on added · total ₹${pricing.total}`);
        api.getBooking(bookingId).then((fresh) => mounted && setBooking(fresh));
      });
      socket.on("booking:failed", ({ reason }) => {
        pushLog(`failed: ${reason}`);
        Alert.alert("No therapist found", "We couldn't reach anyone in 15 min. Try again?");
      });
      socket.on("booking:searching", ({ candidateEtaMin }) =>
        pushLog(`offering nearby therapist · ETA ${candidateEtaMin} min`)
      );
    }

    init();
    return () => {
      mounted = false;
      if (socket) {
        ["booking:status","booking:assigned","booking:expert_location","booking:arrived","booking:addon","booking:failed","booking:searching"]
          .forEach((e) => socket.off(e));
        socket.emit("booking:unsubscribe", { bookingId });
      }
    };
  }, [bookingId]);

  const mapCenter = useMemo(() => {
    if (!booking) return { lat: 12.9716, lng: 77.6411 };
    return { lat: booking.location.lat, lng: booking.location.lng };
  }, [booking]);

  const markers = useMemo(() => {
    const arr = [];
    if (booking) {
      arr.push({
        id: "pickup",
        position: { lat: booking.location.lat, lng: booking.location.lng },
        icon: "📍",
        size: [32, 32],
      });
    }
    if (expertLoc?.lat && expertLoc?.lng) {
      arr.push({
        id: "expert",
        position: { lat: expertLoc.lat, lng: expertLoc.lng },
        icon: "🚗",
        size: [40, 40],
      });
    }
    return arr;
  }, [booking, expertLoc]);

  async function openAddOnPicker() {
    const all = await api.listServices();
    setAddOnable(all.filter((s) => s.addOnEligible));
    setPickerOpen(true);
  }
  async function pickAddOn(svc) {
    setPickerOpen(false);
    try { await api.addAddOn(bookingId, svc.id); }
    catch (e) { Alert.alert("Could not add", e.message); }
  }
  async function payNow() {
    try {
      await api.pay(bookingId);
      const fresh = await api.getBooking(bookingId);
      setBooking(fresh);
      Alert.alert("Paid", "Payment captured (test mode).");
    } catch (e) { Alert.alert("Payment failed", e.message); }
  }
  function cancelBooking() {
    Alert.alert("Cancel booking?", "You won't be charged.", [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel", style: "destructive",
        onPress: async () => {
          try { await api.cancelBooking(bookingId); navigation.replace("Home"); }
          catch (e) { Alert.alert("Could not cancel", e.message); }
        },
      },
    ]);
  }

  if (!booking) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={palette.ink} />
        </View>
      </Screen>
    );
  }

  const isActive = ["assigned", "in_progress"].includes(booking.status);
  const canAddOn = isActive;

  return (
    <Screen edges={["top"]} scroll>
      <Header title="Live booking" onBack={() => navigation.replace("Home")} />

      {/* Status hero */}
      <Card tone="ink" elevation="md" radius={radii.xxl} padding={spacing.xl} style={{ marginTop: spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text variant="caption" style={{ color: palette.textOnInk, opacity: 0.7 }}>
            Booking #{booking.id.slice(-6).toUpperCase()}
          </Text>
          <StatusBadge status={booking.status} size="sm" />
        </View>

        <Text variant="display" style={{ color: palette.textOnInk, marginTop: spacing.md, fontSize: 28, lineHeight: 34 }}>
          {headlineFor(booking)}
        </Text>

        {booking.quotedEtaMin != null && booking.status === "assigned" && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.md }}>
            <Feather name="clock" size={14} color={palette.gold} />
            <Text variant="bodyMd" style={{ color: palette.gold, marginLeft: 6 }}>
              ETA {booking.quotedEtaMin} min
            </Text>
          </View>
        )}

        <View style={{ height: spacing.lg }} />
        <Timeline status={booking.status} />
      </Card>

      {/* Expert card */}
      {booking.expert ? (
        <Card elevation="sm" style={{ marginTop: spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar uri={booking.expert.photoUrl} name={booking.expert.name} size={56} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text variant="caption" color="muted">Your therapist</Text>
              <Text variant="h3" style={{ marginTop: 2 }}>{booking.expert.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Feather name="star" size={12} color={palette.gold} />
                <Text variant="bodySm" color="secondary" style={{ marginLeft: 4 }}>
                  {(booking.expert.rating || 0).toFixed(1)} · verified
                </Text>
              </View>
            </View>
            <IconButton tone="surface" elevated>
              <Feather name="phone" size={18} color={palette.ink} />
            </IconButton>
            <View style={{ width: spacing.sm }} />
            <IconButton tone="ink">
              <Feather name="message-circle" size={18} color={palette.textOnInk} />
            </IconButton>
          </View>
        </Card>
      ) : null}

      {/* Map */}
      <Card padding={0} elevation="md" radius={radii.xxl} style={{ marginTop: spacing.lg, overflow: "hidden" }}>
        <View style={{ height: 260, backgroundColor: palette.surfaceSoft }}>
          <LeafletView
            mapCenterPosition={mapCenter}
            zoom={14}
            mapMarkers={markers}
          />
        </View>
      </Card>

      {/* Items */}
      <Text variant="h3" style={{ marginTop: spacing.xxl }}>Booking summary</Text>
      <View style={{ height: spacing.sm }} />
      <Card padding={0} elevation="sm">
        {booking.items.map((it, idx) => (
          <View key={idx}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: spacing.lg }}>
              <View
                style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: it.isAddOn ? palette.purpleSoft : palette.surfaceSoft,
                  alignItems: "center", justifyContent: "center",
                  marginRight: spacing.md,
                }}
              >
                <Feather name={it.isAddOn ? "plus" : "feather"} size={16} color={it.isAddOn ? palette.purpleDeep : palette.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMd" numberOfLines={1}>{it.name}</Text>
                <Text variant="bodySm" color="secondary" style={{ marginTop: 2 }}>
                  {it.durationMin} min · {it.isAddOn ? "Add-on" : "Booked"}
                </Text>
              </View>
              <Text variant="price">₹{it.price}</Text>
            </View>
            {idx < booking.items.length - 1 && <Divider my={0} />}
          </View>
        ))}
        <Divider my={0} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: spacing.lg }}>
          <Text variant="h3">Total</Text>
          <Text variant="price" color="ink">₹{booking.pricing.total}</Text>
        </View>
      </Card>

      {/* Actions */}
      <View style={{ height: spacing.lg }} />
      {canAddOn && (
        <Button
          title="Add another massage"
          variant="subtle"
          fullWidth
          onPress={openAddOnPicker}
          leftIcon={<Feather name="plus" size={18} color={palette.ink} />}
        />
      )}

      {booking.status === "completed" && booking.payment?.status !== "paid" && (
        <>
          <View style={{ height: spacing.md }} />
          <Button
            title={`Pay ₹${booking.pricing.total} (test)`}
            variant="primary"
            fullWidth
            onPress={payNow}
          />
        </>
      )}

      {!["completed", "cancelled"].includes(booking.status) && (
        <>
          <View style={{ height: spacing.md }} />
          <Button
            title="Cancel booking"
            variant="ghost"
            fullWidth
            onPress={cancelBooking}
          />
        </>
      )}

      {/* Activity log */}
      <Text variant="h3" style={{ marginTop: spacing.xxxl }}>Activity</Text>
      <View style={{ height: spacing.sm }} />
      <Card elevation="sm">
        {logs.length === 0 ? (
          <Text variant="bodySm" color="muted">Waiting for events…</Text>
        ) : (
          logs.map((l, i) => (
            <View key={i} style={{ flexDirection: "row", paddingVertical: 4 }}>
              <Text variant="bodySm" color="muted" style={{ width: 64 }}>
                {new Date(l.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
              <Text variant="bodySm" style={{ flex: 1 }}>{l.msg}</Text>
            </View>
          ))
        )}
      </Card>

      {/* Add-on picker modal */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={{ flex: 1, backgroundColor: palette.overlay, justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: palette.bg,
              borderTopLeftRadius: radii.xxl,
              borderTopRightRadius: radii.xxl,
              padding: spacing.xl,
              maxHeight: "75%",
            }}
          >
            <View style={{ alignItems: "center", marginBottom: spacing.md }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: palette.hairline }} />
            </View>
            <Text variant="h2">Add an add-on</Text>
            <Text variant="bodySm" color="secondary" style={{ marginTop: 4 }}>
              These are billed on top of your current booking.
            </Text>
            <View style={{ height: spacing.lg }} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {addOnable.map((s) => (
                <Pressable
                  key={s.id}
                  onPress={() => pickAddOn(s)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: palette.surface,
                      borderRadius: radii.xl,
                      padding: spacing.lg,
                      marginBottom: spacing.sm,
                      flexDirection: "row",
                      alignItems: "center",
                      opacity: pressed ? 0.92 : 1,
                    },
                    shadows.sm,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyMd">{s.name}</Text>
                    <Text variant="bodySm" color="secondary" style={{ marginTop: 2 }}>{s.durationMin} min</Text>
                  </View>
                  <Text variant="price">₹{s.price}</Text>
                  <View style={{ width: spacing.md }} />
                  <View
                    style={{
                      width: 32, height: 32, borderRadius: 16,
                      backgroundColor: palette.ink,
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Feather name="plus" size={16} color={palette.textOnInk} />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <View style={{ height: spacing.md }} />
            <Button title="Close" variant="subtle" fullWidth onPress={() => setPickerOpen(false)} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

/* ---------- pieces ---------- */

function Header({ title, onBack }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.sm }}>
      <IconButton elevated onPress={onBack}>
        <Feather name="arrow-left" size={18} color={palette.ink} />
      </IconButton>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text variant="h3">{title}</Text>
      </View>
      <View style={{ width: 44 }} />
    </View>
  );
}

function headlineFor(b) {
  switch (b.status) {
    case "created":     return "Hold tight…";
    case "searching":   return "Finding the\nclosest therapist";
    case "assigned":    return "Therapist is\non the way";
    case "in_progress": return "Enjoy your\nsession";
    case "completed":   return "All done.\nThanks for booking.";
    case "cancelled":   return "Booking\ncancelled";
    default:            return b.status;
  }
}

function Timeline({ status }) {
  const order = ["searching", "assigned", "in_progress", "completed"];
  const idx = order.indexOf(status === "created" ? "searching" : status);
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {STAGES.map((s, i) => {
        const done = i <= idx;
        const active = i === idx && status !== "completed";
        // active = gold-haloed circle so it pops against ink. done = peach.
        const bg = active ? palette.gold : done ? palette.peach : "rgba(255,255,255,0.12)";
        const iconColor = active || done ? palette.ink : palette.textOnInk;
        return (
          <React.Fragment key={s.key}>
            <View style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 30, height: 30, borderRadius: 15,
                  backgroundColor: bg,
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <Feather name={s.icon} size={14} color={iconColor} />
              </View>
              <Text
                variant="caption"
                style={{
                  color: done ? palette.textOnInk : "rgba(244,237,226,0.5)",
                  marginTop: 6,
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {s.label.split(" ")[0]}
              </Text>
            </View>
            {i < STAGES.length - 1 && (
              <View
                style={{
                  flex: 0.6,
                  height: 2,
                  backgroundColor: i < idx ? palette.peach : "rgba(255,255,255,0.12)",
                  marginBottom: 18,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
