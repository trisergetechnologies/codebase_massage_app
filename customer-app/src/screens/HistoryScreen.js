import React, { useEffect, useState } from "react";
import { View, FlatList, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Screen, Text, Card, IconButton, StatusBadge, BottomNav } from "../ui";
import { palette, spacing, radii, layout } from "../theme/tokens";
import { api } from "../api";

export default function HistoryScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try { setBookings(await api.listBookings()); }
    finally { setLoading(false); setRefreshing(false); }
  }
  useEffect(() => { load(); }, []);

  return (
    <Screen edges={["top"]} noPadding>
      <View style={{ paddingHorizontal: layout.screenPadding }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.md }}>
          <IconButton elevated onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={18} color={palette.ink} />
          </IconButton>
          <View style={{ flex: 1 }} />
          <IconButton elevated>
            <Feather name="more-horizontal" size={18} color={palette.ink} />
          </IconButton>
        </View>
        <View style={{ height: spacing.lg }} />
        <Text variant="h1">My bookings</Text>
        <Text variant="bodySm" color="secondary" style={{ marginTop: spacing.sm }}>
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"} so far.
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={palette.ink} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{
            paddingHorizontal: layout.screenPadding,
            paddingTop: spacing.lg,
            paddingBottom: layout.scrollBottomGuard,
          }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); load(); }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingTop: 80 }}>
              <View
                style={{
                  width: 64, height: 64, borderRadius: 32,
                  backgroundColor: palette.surfaceSoft,
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <Feather name="moon" size={26} color={palette.textMuted} />
              </View>
              <Text variant="h3" color="secondary" style={{ marginTop: spacing.md }}>
                No bookings yet
              </Text>
              <Text variant="bodySm" color="muted" style={{ marginTop: 4 }}>
                When you book a session, it'll show up here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card
              radius={radii.xxl}
              onPress={() => navigation.navigate("Booking", { bookingId: item.id })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <StatusBadge status={item.status} size="sm" />
                <Text variant="bodySm" color="muted">
                  {new Date(item.createdAt).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}
                </Text>
              </View>
              <Text variant="h3" numberOfLines={2} style={{ marginTop: spacing.md }}>
                {item.items.map((i) => i.name).join(" · ")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: spacing.lg,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather name="clock" size={12} color={palette.textSecondary} />
                  <Text variant="bodySm" color="secondary" style={{ marginLeft: 4 }}>
                    {item.items.reduce((s, i) => s + i.durationMin, 0)} min
                  </Text>
                  <View style={{ width: 1, height: 12, backgroundColor: palette.hairline, marginHorizontal: spacing.sm }} />
                  <Text variant="bodySm" color="secondary">
                    {item.items.length} {item.items.length === 1 ? "service" : "services"}
                  </Text>
                </View>
                <Text variant="price" color="ink">₹{item.pricing.total}</Text>
              </View>
            </Card>
          )}
        />
      )}

      <BottomNav active="profile" />
    </Screen>
  );
}
