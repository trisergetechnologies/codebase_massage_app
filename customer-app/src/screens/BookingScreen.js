import React, { useEffect, useMemo, useState } from "react";
import {
  View, Pressable, Alert, Modal, ActivityIndicator, ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LeafletView } from "react-native-leaflet-view";

import {
  Screen, Text, Button, Card, IconButton, StatusBadge, Avatar, Divider,
} from "../ui";
import { palette, spacing, radii, shadows } from "../theme/tokens";
import { api } from "../api";
import { getSocket } from "../socket";
import { getJourneyVisibility, getScreenTitle } from "../utils/bookingJourney";

const STAGES = [
  { key: "searching", label: "Finding expert", icon: "search" },
  { key: "assigned", label: "Expert assigned", icon: "navigation" },
  { key: "in_progress", label: "In progress", icon: "activity" },
  { key: "completed", label: "Completed", icon: "check-circle" },
];

export default function BookingScreen({ route, navigation }) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [expertLoc, setExpertLoc] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addOnable, setAddOnable] = useState([]);
  const [candidateEtaMin, setCandidateEtaMin] = useState(null);
  const [paying, setPaying] = useState(false);

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

      socket.on("booking:status", () => {
        api.getBooking(bookingId).then((fresh) => mounted && setBooking(fresh));
      });
      socket.on("booking:assigned", (data) => {
        setCandidateEtaMin(null);
        if (data.expert?.location) setExpertLoc(data.expert.location);
        api.getBooking(bookingId).then((fresh) => mounted && setBooking(fresh));
      });
      socket.on("booking:expert_location", ({ lat, lng }) => setExpertLoc({ lat, lng }));
      socket.on("booking:arrived", () => {
        api.getBooking(bookingId).then((fresh) => mounted && setBooking(fresh));
      });
      socket.on("booking:addon", () => {
        api.getBooking(bookingId).then((fresh) => mounted && setBooking(fresh));
      });
      socket.on("booking:failed", () => {
        Alert.alert("No expert found", "We couldn't reach anyone nearby. Please try again.");
      });
      socket.on("booking:searching", ({ candidateEtaMin: eta }) => {
        if (eta != null) setCandidateEtaMin(eta);
      });
      socket.on("booking:payment", () => {
        api.getBooking(bookingId).then((fresh) => mounted && setBooking(fresh));
      });
    }

    init();
    return () => {
      mounted = false;
      if (socket) {
        ["booking:status", "booking:assigned", "booking:expert_location", "booking:arrived", "booking:addon", "booking:failed", "booking:searching", "booking:payment"]
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
    setPaying(true);
    try {
      await api.pay(bookingId);
      const fresh = await api.getBooking(bookingId);
      setBooking(fresh);
    } catch (e) { Alert.alert("Payment failed", e.message); }
    finally { setPaying(false); }
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

  const visibility = getJourneyVisibility(booking);
  const canAddOn = booking.status === "in_progress";
  const eta = booking.liveEtaMin ?? booking.quotedEtaMin ?? candidateEtaMin;
  const showExpertOnMap = visibility.mapMode === "live";

  return (
    <Screen edges={["top"]} scroll>
      <Header title={getScreenTitle(booking.status)} onBack={() => navigation.replace("Home")} />

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

        <Text variant="bodySm" style={{ color: palette.textOnInk, opacity: 0.75, marginTop: spacing.sm }}>
          {subcopyFor(booking, candidateEtaMin)}
        </Text>

        {visibility.showEta && eta != null && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.md, flexWrap: "wrap", gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="clock" size={14} color={palette.gold} />
              <Text variant="bodyMd" style={{ color: palette.gold, marginLeft: 6 }}>
                ETA {eta} min
              </Text>
            </View>
            {booking.distanceKm != null && booking.status === "assigned" && (
              <Text variant="bodySm" style={{ color: palette.textOnInk, opacity: 0.7 }}>
                · {booking.distanceKm} km away
              </Text>
            )}
          </View>
        )}

        {visibility.showTimeline ? (
          <>
            <View style={{ height: spacing.lg }} />
            <Timeline status={booking.status} />
          </>
        ) : null}
      </Card>

      {visibility.showExpertCard && booking.expert ? (
        <Card elevation="sm" style={{ marginTop: spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar uri={booking.expert.photoUrl} name={booking.expert.name} size={56} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text variant="caption" color="muted">Your expert</Text>
              <Text variant="h3" style={{ marginTop: 2 }}>{booking.expert.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Feather name="star" size={12} color={palette.gold} />
                <Text variant="bodySm" color="secondary" style={{ marginLeft: 4 }}>
                  {(booking.expert.rating || 0).toFixed(1)} · verified
                </Text>
              </View>
            </View>
          </View>
        </Card>
      ) : null}

      {visibility.mapMode !== "hidden" && (
        <Card padding={0} elevation="md" radius={radii.xxl} style={{ marginTop: spacing.lg, overflow: "hidden" }}>
          <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm }}>
            <Text variant="caption" color="muted">
              {visibility.mapMode === "address" ? "Service address" : "Live map"}
            </Text>
            {visibility.mapMode === "address" ? (
              <Text variant="bodySm" color="secondary" style={{ marginTop: 4 }}>
                Expert will appear here once assigned
              </Text>
            ) : null}
          </View>
          <View style={{ height: 260, backgroundColor: palette.surfaceSoft }}>
            <LeafletView
              mapCenterPosition={mapCenter}
              zoom={14}
              mapMarkers={showExpertOnMap ? markers : markers.filter((m) => m.id === "pickup")}
            />
          </View>
        </Card>
      )}

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

      <View style={{ height: spacing.lg }} />
      {visibility.needsPayment && (
        <Button
          title={
            booking.status === "awaiting_payment"
              ? `Pay ₹${booking.pricing.total} to confirm`
              : `Pay ₹${booking.pricing.total}`
          }
          variant="primary"
          fullWidth
          loading={paying}
          onPress={payNow}
        />
      )}
      {canAddOn && (
        <>
          <View style={{ height: spacing.md }} />
          <Button
            title="Add another massage"
            variant="subtle"
            fullWidth
            onPress={openAddOnPicker}
            leftIcon={<Feather name="plus" size={18} color={palette.ink} />}
          />
        </>
      )}

      {visibility.showCancel && (
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
    case "awaiting_payment": return "Complete\npayment to confirm";
    case "created": return "Booking\nrequested";
    case "searching": return "Finding an\nexpert for you";
    case "assigned": return "Expert\nassigned";
    case "in_progress": return "Enjoy your\nsession";
    case "completed": return "All done.\nThanks for booking.";
    case "cancelled": return "Booking\ncancelled";
    default: return b.status;
  }
}

function subcopyFor(b, candidateEtaMin) {
  switch (b.status) {
    case "awaiting_payment":
      return "Your booking is saved. Pay now to start finding a verified expert.";
    case "created":
      return "We're preparing your request.";
    case "searching":
      return candidateEtaMin != null
        ? `Searching nearby experts… ~${candidateEtaMin} min away`
        : "Searching nearby verified experts…";
    case "assigned":
      return b.expert?.name ? `${b.expert.name} is on the way.` : "Your expert is on the way.";
    case "in_progress":
      return b.payment?.timing === "pay_later" && b.payment?.status !== "paid"
        ? "Pay before your session ends."
        : "Your expert has arrived. Enjoy your session.";
    case "completed":
      return "Thank you for booking with us.";
    case "cancelled":
      return b.cancelReason ? "This booking was cancelled." : "";
    default:
      return "";
  }
}

function Timeline({ status }) {
  const order = ["searching", "assigned", "in_progress", "completed"];
  let idx = order.indexOf(status);
  if (status === "created") idx = -1;
  if (status === "completed") idx = order.length - 1;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {STAGES.map((s, i) => {
        const done = i <= idx;
        const active = i === idx && status !== "completed";
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
