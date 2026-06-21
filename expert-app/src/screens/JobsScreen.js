import React, { useCallback, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../api";
import { Card, StatusBadge, Text as UiText } from "../ui";
import {
  formatRupee,
  formatWhen,
  getStatusLabel,
  isActiveBooking,
} from "../utils/booking";
import { palette, spacing, radii } from "../theme/tokens";

export default function JobsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    try {
      const list = await api.listBookings();
      setBookings(list);
    } catch (e) {
      setError(e.message);
      setBookings([]);
    }
  }

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [])
  );

  const coming = bookings.filter((b) => isActiveBooking(b.status));

  function renderOrder(b) {
    const label = getStatusLabel(b.status, b.timeline);
    return (
      <Pressable
        key={b.id}
        onPress={() => navigation.navigate("Job", { bookingId: b.id })}
      >
        <Card style={styles.orderCard}>
          <View style={styles.row}>
            <StatusBadge status={b.status} label={label} />
            <UiText variant="accent">{formatRupee(b.pricing?.total)}</UiText>
          </View>
          <UiText variant="subtitle" style={{ marginTop: spacing.sm }}>
            {b.customer?.name || "Customer"}
          </UiText>
          <UiText variant="caption" numberOfLines={1}>
            {b.location?.address ||
              `${b.location?.lat?.toFixed(4)}, ${b.location?.lng?.toFixed(4)}`}
          </UiText>
          <UiText variant="caption" style={{ marginTop: spacing.xs }}>
            {b.items?.length || 0} service(s) · {formatWhen(b.createdAt)}
          </UiText>
        </Card>
      </Pressable>
    );
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.center}>
          <ActivityIndicator color={palette.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <UiText variant="title">Orders</UiText>
      </View>

      {coming.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Feather name="inbox" size={36} color={palette.muted} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyBody}>
            {error
              ? `Could not load orders: ${error}`
              : "When you accept a job, it will show up here. Go online on Home to receive offers."}
          </Text>
          <Pressable
            style={({ pressed }) => [styles.refreshBtn, pressed && styles.refreshBtnPressed]}
            onPress={refresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator color="#0a0d12" />
            ) : (
              <>
                <Feather name="refresh-cw" size={18} color="#0a0d12" />
                <Text style={styles.refreshBtnText}>Refresh orders</Text>
              </>
            )}
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.listWrap}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={palette.accent}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {coming.map(renderOrder)}
          <Pressable
            style={styles.refreshLink}
            onPress={refresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator color={palette.accent} size="small" />
            ) : (
              <>
                <Feather name="refresh-cw" size={16} color={palette.accent} />
                <Text style={styles.refreshLinkText}>Refresh</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  listWrap: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderCard: { borderColor: palette.accent },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.text,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    fontSize: 14,
    color: palette.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: palette.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  refreshBtnPressed: { opacity: 0.85 },
  refreshBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0a0d12",
  },
  refreshLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  refreshLinkText: {
    color: palette.accent,
    fontSize: 14,
    fontWeight: "600",
  },
});
