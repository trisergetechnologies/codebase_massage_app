import React, { useCallback, useState } from "react";
import { View, Switch, ScrollView, StyleSheet, RefreshControl, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useExpertSession } from "../context/ExpertSessionContext";
import { expertService } from "../services/expertService";
import { colors, spacing, radii } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { StatCard } from "../components/ui/StatCard";
import { OrderCard } from "../components/orders/OrderCard";
import { LoadingView } from "../components/feedback/LoadingView";
import { formatRupee } from "../utils/order";

export default function HomeScreen({ navigation }) {
  const { me, goingOnline, setOnline, refreshMe } = useExpertSession();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const [profile, dash] = await Promise.all([refreshMe(), expertService.dashboard()]);
    setDashboard(dash);
    return profile;
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load()
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  if (loading && !me) return <LoadingView />;

  const isOnline = me?.status === "online" || me?.status === "on_job";
  const onJob = me?.status === "on_job";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <AppText variant="h1">Home</AppText>
          <View style={styles.onlineRow}>
            <AppText variant="body" style={{ fontWeight: "600" }}>
              {isOnline ? "Online" : "Offline"}
            </AppText>
            <Switch
              value={isOnline}
              onValueChange={setOnline}
              disabled={onJob || goingOnline}
              trackColor={{ true: colors.online, false: colors.border }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={[styles.statusCard, isOnline ? styles.statusOnline : styles.statusOffline]}>
          <Feather name={isOnline ? "radio" : "moon"} size={20} color={isOnline ? colors.success : colors.textSecondary} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <AppText variant="h3">{onJob ? "On active order" : isOnline ? "Receiving orders" : "You are offline"}</AppText>
            <AppText variant="caption" color="secondary">
              {onJob
                ? "Complete the job before going offline."
                : isOnline
                  ? "Keep this app open — new orders pop up full screen."
                  : "Toggle online to receive nearby bookings."}
            </AppText>
          </View>
        </View>

        {onJob && me?.activeBooking && (
          <Pressable
            style={styles.activeCta}
            onPress={() => navigation.navigate("ActiveOrder", { bookingId: me.activeBooking })}
          >
            <AppText variant="h3" style={{ color: "#fff" }}>
              Open active order →
            </AppText>
          </Pressable>
        )}

        <View style={styles.statsRow}>
          <StatCard label="Today orders" value={String(dashboard?.today?.orders ?? 0)} />
          <View style={{ width: spacing.md }} />
          <StatCard label="Today earnings" value={formatRupee(dashboard?.today?.earnings ?? 0)} />
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Rating" value={(me?.rating || 0).toFixed(1)} sub="★ average" />
          <View style={{ width: spacing.md }} />
          <StatCard label="Completed" value={String(me?.completedJobs || 0)} sub="all time" />
        </View>

        <AppText variant="label" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
          Recent orders
        </AppText>
        {(dashboard?.recentOrders || []).length === 0 ? (
          <AppText variant="body" color="secondary">
            No orders yet today.
          </AppText>
        ) : (
          dashboard.recentOrders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onPress={() => navigation.navigate("ActiveOrder", { bookingId: o.id })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  statusOnline: { backgroundColor: colors.successBg, borderColor: "#A7F3D0" },
  statusOffline: { backgroundColor: colors.surface, borderColor: colors.border },
  activeCta: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radii.lg,
    marginBottom: spacing.lg,
  },
  statsRow: { flexDirection: "row", marginBottom: spacing.md },
});
