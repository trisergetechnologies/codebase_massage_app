import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LeafletView } from "react-native-leaflet-view";
import { bookingService } from "../services/bookingService";
import { getSocket } from "../socket";
import { useExpertSession } from "../context/ExpertSessionContext";
import { colors, spacing, radii } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { OTPInput } from "../components/ui/OTPInput";
import { LoadingView } from "../components/feedback/LoadingView";
import {
  formatRupee,
  getActiveOrderStep,
  serviceSummary,
  totalDurationMin,
} from "../utils/order";

const STEPS = [
  { key: "navigating", label: "Navigating" },
  { key: "arrived", label: "Arrived" },
  { key: "start_otp", label: "Start OTP" },
  { key: "session", label: "Session" },
  { key: "end_otp", label: "End OTP" },
  { key: "complete", label: "Complete" },
];

function expertEarning(booking) {
  return (
    booking?.expertEarning ||
    Math.round((booking?.pricing?.subtotal || 0) * 0.7)
  );
}

export default function ActiveOrderScreen({ route, navigation }) {
  const { bookingId } = route.params;
  const { refreshMe } = useExpertSession();
  const [booking, setBooking] = useState(null);
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [startOtpMode, setStartOtpMode] = useState(false);
  const [endOtpMode, setEndOtpMode] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  async function load() {
    const b = await bookingService.get(bookingId);
    setBooking(b);
    if (b.status === "completed") setSessionComplete(true);
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
      socket.on("booking:arrived", reload);
      socket.on("booking:addon", reload);
    })();
    return () => {
      mounted = false;
      if (socket) {
        socket.off("booking:status");
        socket.off("booking:arrived");
        socket.off("booking:addon");
        socket.emit("booking:unsubscribe", { bookingId });
      }
    };
  }, [bookingId]);

  const baseStep = getActiveOrderStep(booking);
  const step = useMemo(() => {
    if (sessionComplete || booking?.status === "completed") return "complete";
    if (baseStep === "arrived" && startOtpMode) return "start_otp";
    if (baseStep === "session" && endOtpMode) return "end_otp";
    return baseStep;
  }, [baseStep, startOtpMode, endOtpMode, sessionComplete, booking?.status]);

  const bookedMin = totalDurationMin(booking?.items || []);

  useEffect(() => {
    if (step !== "session" || !booking?.timeline?.startedAt) return undefined;
    const start = new Date(booking.timeline.startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [step, booking?.timeline?.startedAt]);

  const timerDisplay = useMemo(() => {
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [elapsed]);

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
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    ).catch(() => Alert.alert("Could not open maps"));
  }

  async function runAction() {
    setBusy(true);
    try {
      if (step === "navigating") {
        await bookingService.arrived(bookingId);
        setStartOtpMode(false);
      } else if (step === "start_otp") {
        await bookingService.start(bookingId, otp);
        setOtp("");
        setStartOtpMode(false);
      } else if (step === "end_otp") {
        await bookingService.complete(bookingId, otp);
        setOtp("");
        setEndOtpMode(false);
        await refreshMe();
        await load();
        setSessionComplete(true);
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

  if (!booking) return <LoadingView message="Loading order…" />;

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const etaMin = booking.liveEtaMin ?? booking.quotedEtaMin;
  const distanceKm = booking.distanceKm;

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.scroll}>
      <View style={styles.stepper}>
        {STEPS.slice(0, 5).map((s, i) => (
          <View
            key={s.key}
            style={[styles.stepDot, i <= stepIndex && styles.stepDotDone]}
          />
        ))}
      </View>

      <AppText variant="label">Active order</AppText>
      <AppText variant="h1">{booking.customer?.name || "Customer"}</AppText>
      <AppText variant="body" color="secondary">
        {serviceSummary(booking.items)} · {bookedMin} min booked
      </AppText>

      {step === "navigating" && (etaMin != null || distanceKm != null) && (
        <View style={styles.metaRow}>
          {etaMin != null && (
            <AppText variant="body" color="secondary">
              ETA ~{Math.round(etaMin)} min
            </AppText>
          )}
          {distanceKm != null && (
            <AppText variant="body" color="secondary">
              {distanceKm} km away
            </AppText>
          )}
        </View>
      )}

      {step === "navigating" && booking.location && (
        <View style={styles.mapCard}>
          <LeafletView
            mapCenterPosition={mapCenter}
            zoom={15}
            mapMarkers={markers}
            doDebug={false}
          />
        </View>
      )}

      <View style={styles.address}>
        <Feather name="map-pin" size={18} color={colors.textSecondary} />
        <AppText variant="body" style={{ flex: 1, marginLeft: spacing.sm }}>
          {booking.location?.address ||
            `${booking.location?.lat}, ${booking.location?.lng}`}
        </AppText>
      </View>

      {step === "navigating" && (
        <>
          <PrimaryButton
            title="Go to location"
            variant="outline"
            onPress={openMaps}
          />
          <PrimaryButton
            title="I've arrived"
            onPress={runAction}
            loading={busy}
            style={{ marginTop: spacing.md }}
          />
        </>
      )}

      {step === "arrived" && (
        <View style={styles.arrivedBox}>
          <Feather name="check-circle" size={40} color={colors.primary} />
          <AppText variant="h2" style={{ marginTop: spacing.md }}>
            You've arrived
          </AppText>
          <AppText variant="body" color="secondary" style={{ marginTop: spacing.sm, textAlign: "center" }}>
            Ask the customer for their start OTP when you're ready to begin the session.
          </AppText>
          <PrimaryButton
            title="Enter start OTP"
            onPress={() => setStartOtpMode(true)}
            style={{ marginTop: spacing.lg, alignSelf: "stretch" }}
          />
        </View>
      )}

      {step === "start_otp" && (
        <View style={styles.otpBlock}>
          <AppText variant="body">Enter start OTP from customer</AppText>
          {__DEV__ && booking.sessionOtp?.startCode ? (
            <AppText variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
              Dev hint: {booking.sessionOtp.startCode}
            </AppText>
          ) : null}
          <OTPInput value={otp} onChangeText={setOtp} />
          <PrimaryButton
            title="Verify & start session"
            onPress={runAction}
            loading={busy}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      )}

      {step === "session" && (
        <View style={styles.sessionBox}>
          <AppText variant="label">Session running</AppText>
          <AppText variant="h1" style={styles.timer}>
            {timerDisplay}
          </AppText>
          <AppText variant="caption" color="muted">
            Booked duration: {bookedMin} min
          </AppText>
          {(booking.items || []).some((i) => i.isAddOn) && (
            <AppText variant="caption" color="secondary" style={{ marginTop: spacing.sm }}>
              Customer add-ons are included in this session.
            </AppText>
          )}
          <PrimaryButton
            title="End session — enter OTP"
            onPress={() => setEndOtpMode(true)}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      )}

      {step === "end_otp" && (
        <View style={styles.otpBlock}>
          <AppText variant="body">Enter end OTP from customer</AppText>
          {__DEV__ && booking.sessionOtp?.endCode ? (
            <AppText variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
              Dev hint: {booking.sessionOtp.endCode}
            </AppText>
          ) : null}
          <OTPInput value={otp} onChangeText={setOtp} />
          <PrimaryButton
            title="Verify & complete order"
            onPress={runAction}
            loading={busy}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      )}

      {step === "complete" && (
        <View style={styles.completeBox}>
          <Feather name="award" size={44} color={colors.primary} />
          <AppText variant="h2" style={{ marginTop: spacing.md }}>
            Session complete
          </AppText>
          <AppText variant="body" color="secondary" style={{ marginTop: spacing.xs }}>
            Great work — earnings have been recorded.
          </AppText>
          <View style={styles.earnCard}>
            <AppText variant="label">You earned</AppText>
            <AppText variant="h1">{formatRupee(expertEarning(booking))}</AppText>
          </View>
          <PrimaryButton
            title="Back to receiving orders"
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.lg, alignSelf: "stretch" }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  stepper: { flexDirection: "row", gap: 6, marginBottom: spacing.lg },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  stepDotDone: { backgroundColor: colors.primary },
  metaRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  mapCard: {
    height: 200,
    marginTop: spacing.md,
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  address: {
    flexDirection: "row",
    marginVertical: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  arrivedBox: {
    marginTop: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  otpBlock: { marginTop: spacing.lg },
  sessionBox: {
    marginTop: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  timer: { fontSize: 48, marginVertical: spacing.lg },
  completeBox: {
    marginTop: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  earnCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    alignItems: "center",
    alignSelf: "stretch",
  },
});
