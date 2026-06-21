import React, { useCallback, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { earningsService } from "../services/earningsService";
import { colors, spacing, radii } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { LoadingView } from "../components/feedback/LoadingView";
import { formatRupee } from "../utils/order";

const PERIODS = ["today", "week", "month"];

export default function EarningsScreen() {
  const [period, setPeriod] = useState("today");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const res = await earningsService.get(period);
    setData(res);
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load()
        .catch(() => setData(null))
        .finally(() => setLoading(false));
    }, [period])
  );

  if (loading && !data) return <LoadingView message="Loading earnings…" />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
          />
        }
      >
        <AppText variant="h1">Earnings</AppText>

        <View style={styles.tabs}>
          {PERIODS.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.tab, period === p && styles.tabActive]}
            >
              <AppText style={{ fontWeight: period === p ? "700" : "500", textTransform: "capitalize" }}>
                {p}
              </AppText>
            </Pressable>
          ))}
        </View>

        <View style={styles.totalCard}>
          <AppText variant="label">Total earnings</AppText>
          <AppText variant="h1" style={{ marginTop: spacing.xs }}>
            {formatRupee(data?.total ?? 0)}
          </AppText>
          <AppText variant="caption" color="secondary">
            {data?.orderCount ?? 0} completed orders
          </AppText>
        </View>

        <View style={styles.breakdown}>
          <BreakdownRow label="Base salary" value={formatRupee(data?.baseSalary ?? 0)} />
          <BreakdownRow label="Commission" value={formatRupee(data?.commission ?? 0)} />
          <BreakdownRow label="Bonus" value={formatRupee(data?.bonus ?? 0)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BreakdownRow({ label, value }) {
  return (
    <View style={styles.row}>
      <AppText variant="body">{label}</AppText>
      <AppText variant="h3">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  tabs: {
    flexDirection: "row",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: "center", borderRadius: radii.sm },
  tabActive: { backgroundColor: colors.surface },
  totalCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdown: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
});
