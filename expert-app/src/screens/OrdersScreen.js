import React, { useCallback, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bookingService } from "../services/bookingService";
import { colors, spacing, radii } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { OrderCard } from "../components/orders/OrderCard";
import { LoadingView } from "../components/feedback/LoadingView";
import { EmptyState } from "../components/feedback/EmptyState";

export default function OrdersScreen({ navigation }) {
  const [tab, setTab] = useState("today");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    try {
      const list = await bookingService.list(tab);
      setOrders(list);
    } catch (e) {
      setError(e.message);
      setOrders([]);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [tab])
  );

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const display = orders;

  if (loading && !refreshing) return <LoadingView message="Loading orders…" />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <AppText variant="h1" style={styles.title}>
        Orders
      </AppText>

      <View style={styles.tabs}>
        {["today", "history"].map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <AppText variant="body" style={{ fontWeight: tab === t ? "700" : "500", color: tab === t ? colors.text : colors.textSecondary }}>
              {t === "today" ? "Today" : "History"}
            </AppText>
          </Pressable>
        ))}
      </View>

      {display.length === 0 ? (
        <EmptyState
          icon="package"
          title={tab === "today" ? "No orders today" : "No history"}
          message={error || "Pull to refresh or tap below to load orders."}
          actionLabel="Refresh"
          onAction={refresh}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          {display.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onPress={() => navigation.navigate("ActiveOrder", { bookingId: o.id })}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  title: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  tabs: {
    flexDirection: "row",
    margin: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: "center", borderRadius: radii.sm },
  tabActive: { backgroundColor: colors.surface },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
});
