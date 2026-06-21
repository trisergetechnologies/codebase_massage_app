import React, { useEffect, useMemo, useState } from "react";
import {
  View, ScrollView, Image, Pressable, ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { Screen, Text, Button, IconButton, Card } from "../ui";
import { palette, spacing, radii, shadows, layout } from "../theme/tokens";
import { api } from "../api";
import { useCart } from "../CartContext";

/**
 * ServiceDetailScreen — premium service-detail page modeled on the salon-app
 * reference (the brown "Book Appointment" screen).
 *
 * Layout:
 *   ┌────────────────────────────┐
 *   │ ←                          │
 *   │     [hero photo]           │
 *   │     on cream backdrop      │
 *   ├────────────────────────────┤
 *   │ ★ 4.8                      │
 *   │ Service name                │
 *   │ Category sub                │
 *   │ ₹price/session              │
 *   │                            │
 *   │ [Duration][Pro][Includes][↗]│  4 stat chips
 *   │                            │
 *   │ About | Reviews | Includes │  tabs
 *   │ ─────                       │
 *   │ Body text...                │
 *   │                            │
 *   │ Recent images grid         │
 *   ├────────────────────────────┤
 *   │ [   Book Appointment   ]   │  sticky bottom CTA
 *   └────────────────────────────┘
 */
const TABS = [
  { id: "about",    label: "About"    },
  { id: "includes", label: "Includes" },
  { id: "reviews",  label: "Reviews"  },
];

// Static gallery imagery (illustrative — would come from CMS in production)
const GALLERY = [
  "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=400&q=80",
  "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80",
  "https://images.unsplash.com/photo-1620912189865-ba2cb6c668d1?w=400&q=80",
];

export default function ServiceDetailScreen({ route, navigation }) {
  const { serviceId, service: passedService } = route.params || {};
  const [service, setService] = useState(passedService || null);
  const [loading, setLoading] = useState(!passedService);
  const [tab, setTab] = useState("about");
  const [fav, setFav] = useState(false);
  const cart = useCart();

  useEffect(() => {
    if (passedService) return;
    (async () => {
      try {
        // Backend doesn't expose getService; pull list and find by id.
        const all = await api.listServices();
        const found = all.find((s) => s.id === serviceId);
        setService(found);
      } finally { setLoading(false); }
    })();
  }, [serviceId, passedService]);

  const inCart = useMemo(
    () => !!service && !!cart.items.find((i) => i.id === service.id),
    [cart.items, service]
  );

  function bookNow() {
    if (!service) return;
    if (!inCart) cart.add(service);
    navigation.navigate("Cart");
  }

  if (loading || !service) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={palette.brand} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={["top"]} noPadding>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — photo on a warm cream backdrop, with floating back + bookmark */}
        <View
          style={{
            backgroundColor: palette.surfaceWarm,
            paddingHorizontal: layout.screenPadding,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="chevron-left" size={22} color={palette.textPrimary} />
              <Text variant="bodyMd" style={{ marginLeft: 4 }}>Back</Text>
            </Pressable>
            <Pressable
              onPress={() => setFav((f) => !f)}
              hitSlop={6}
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: palette.surface,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Feather
                name="bookmark"
                size={16}
                color={fav ? palette.brand : palette.textMuted}
              />
            </Pressable>
          </View>

          {/* Photo + side info layout, matching reference */}
          <View style={{ flexDirection: "row", marginTop: spacing.lg }}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="star" size={14} color={palette.gold} />
                <Text variant="bodyMd" style={{ marginLeft: 4 }}>
                  {(service.rating || 4.8).toFixed(1)}
                </Text>
              </View>
              <Text variant="h1" style={{ marginTop: spacing.sm }}>
                {service.name}
              </Text>
              <Text variant="bodySm" color="muted" style={{ marginTop: 4 }}>
                {service.skillTag?.replace(/_/g, " ")} massage
              </Text>
              <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: spacing.md }}>
                <Text variant="priceLg" style={{ color: palette.brand }}>₹</Text>
                <Text variant="priceLg">{service.price}</Text>
                <Text variant="bodySm" color="muted" style={{ marginLeft: 4 }}>/session</Text>
              </View>
            </View>
            <Image
              source={{ uri: service.imageUrl }}
              style={{
                width: 140,
                height: 180,
                borderRadius: radii.xl,
              }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Stat chips — 4 cards matching the reference's Call/Message/Direction/Share */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: layout.screenPadding,
            marginTop: spacing.lg,
            gap: spacing.sm,
          }}
        >
          <StatChip icon="clock"     label={`${service.durationMin} min`} />
          <StatChip icon="user"      label="Pro therapist" />
          <StatChip icon="thumbs-up" label="1.2k+ booked" />
          <StatChip icon="share-2"   label="Share" />
        </View>

        {/* Tabs */}
        <View style={{ paddingHorizontal: layout.screenPadding, marginTop: spacing.xxl }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: palette.surfaceWarm,
              borderRadius: radii.pill,
              padding: 4,
            }}
          >
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTab(t.id)}
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: active ? palette.surface : "transparent",
                    borderRadius: radii.pill,
                    paddingVertical: 10,
                    alignItems: "center",
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text variant="bodySmMd" color={active ? "primary" : "muted"}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Tab content */}
          <View style={{ marginTop: spacing.lg }}>
            {tab === "about" && (
              <Text variant="body" color="secondary">
                {service.description ||
                  "A deeply restorative massage designed for full-body relaxation. Performed by a verified, vetted therapist who arrives at your door within 15 minutes — premium oils, warm towels, and a calming routine tailored to you."}
              </Text>
            )}
            {tab === "includes" && (
              <View style={{ gap: spacing.sm }}>
                {[
                  "Verified, background-checked therapist",
                  "Premium aroma oils & warm towels",
                  "Music + ambient setup",
                  "Full session at your home",
                  "Sanitised single-use linens",
                ].map((line) => (
                  <View key={line} style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <View
                      style={{
                        width: 18, height: 18, borderRadius: 9,
                        backgroundColor: palette.brandSoft,
                        alignItems: "center", justifyContent: "center",
                        marginRight: spacing.sm, marginTop: 2,
                      }}
                    >
                      <Feather name="check" size={11} color={palette.brand} />
                    </View>
                    <Text variant="body" color="secondary" style={{ flex: 1 }}>{line}</Text>
                  </View>
                ))}
              </View>
            )}
            {tab === "reviews" && (
              <View style={{ alignItems: "center", paddingVertical: spacing.xl }}>
                <Feather name="star" size={28} color={palette.gold} />
                <Text variant="h2" style={{ marginTop: spacing.sm }}>
                  {(service.rating || 4.8).toFixed(1)} · 1,247 reviews
                </Text>
                <Text variant="bodySm" color="muted" style={{ marginTop: 4, textAlign: "center" }}>
                  Real customer ratings will appear here once they complete a session.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Recent works gallery */}
        <Text
          variant="h3"
          style={{
            paddingHorizontal: layout.screenPadding,
            marginTop: spacing.xxl,
            marginBottom: spacing.md,
          }}
        >
          Recent sessions
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: layout.screenPadding,
            gap: spacing.sm,
          }}
        >
          {GALLERY.map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              style={{
                width: 90,
                height: 90,
                borderRadius: radii.lg,
                backgroundColor: palette.surfaceWarm,
              }}
            />
          ))}
        </ScrollView>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View
        style={[
          {
            position: "absolute",
            left: 0, right: 0, bottom: 0,
            backgroundColor: palette.surface,
            borderTopWidth: 1,
            borderTopColor: palette.hairline,
            paddingHorizontal: layout.screenPadding,
            paddingVertical: spacing.md,
            paddingBottom: spacing.xl,
          },
          shadows.nav,
        ]}
      >
        <Button
          title={inCart ? "View in Cart" : "Book Appointment"}
          onPress={bookNow}
          fullWidth
          size="lg"
          rightIcon={<Feather name="arrow-right" size={18} color={palette.textOnBrand} />}
        />
      </View>
    </Screen>
  );
}

/* ---------------- stat chip (the 4 squares) ---------------- */

function StatChip({ icon, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.sm,
          borderRadius: radii.lg,
          backgroundColor: palette.surface,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.85 : 1,
        },
        shadows.sm,
      ]}
    >
      <View
        style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: palette.brandSoft,
          alignItems: "center", justifyContent: "center",
          marginBottom: 6,
        }}
      >
        <Feather name={icon} size={14} color={palette.brand} />
      </View>
      <Text variant="bodySm" color="primary" numberOfLines={1} style={{ textAlign: "center" }}>
        {label}
      </Text>
    </Pressable>
  );
}
