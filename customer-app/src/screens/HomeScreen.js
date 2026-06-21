import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View, ScrollView, Image, Pressable, ActivityIndicator, Dimensions, RefreshControl, Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import {
  Screen, Text, Avatar, BottomNav,
  SectionHeader, AnimatedSearchBar, HeroCarousel,
} from "../ui";
import { palette, spacing, radii, layout } from "../theme/tokens";
import { api } from "../api";
import { useCart } from "../CartContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const FEATURED_CARD_W = Math.min(210, Math.round(SCREEN_WIDTH * 0.6));
const FEATURED_CARD_H = Math.round(FEATURED_CARD_W * 1.28); // portrait, editorial

const CATEGORY_META = {
  "head-upper-body": { label: "Head & Upper", icon: "user",      tone: "catBlush" },
  "back-core":       { label: "Back & Core",  icon: "maximize-2", tone: "catSand"  },
  "lower-body":      { label: "Lower Body",   icon: "activity",   tone: "catSky"   },
  "full-relaxation": { label: "Full Relax",   icon: "sun",        tone: "catLilac" },
};

const SEARCH_HINTS = [
  "Neck relief",
  "Lower back",
  "Foot relief",
  "Full body relaxation",
  "Posture reset",
];

export default function HomeScreen({ navigation, route }) {
  const [services, setServices] = useState([]);
  const [browseCategories, setBrowseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState({});
  const cart = useCart();
  const searchInputRef = useRef(null);

  async function load() {
    try {
      const [svcs, cats] = await Promise.all([
        api.listServices(),
        api.listCategories(),
      ]);
      setServices(svcs);
      setBrowseCategories(cats);
    }
    finally { setLoading(false); setRefreshing(false); }
  }
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (route?.params?.focusSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      navigation.setParams({ focusSearch: undefined });
    }
  }, [route?.params?.focusSearch]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (filter !== "all" && !s.categories?.includes(filter)) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.description?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [services, filter, query]);

  const featured = visible.slice(0, 4);
  const trending = visible.slice(4);

  const categories = useMemo(() => {
    if (browseCategories.length) return browseCategories.map((c) => c.slug);
    const set = new Set();
    services.forEach((s) => (s.categories || []).forEach((c) => set.add(c)));
    return Array.from(set);
  }, [services, browseCategories]);

  function toggleFav(id) { setFavorites((f) => ({ ...f, [id]: !f[id] })); }

  function goToDetail(s) {
    navigation.navigate("ServiceDetail", { service: s, serviceId: s.id });
  }
  function bookNow(s) {
    if (!cart.items.find((i) => i.id === s.id)) cart.add(s);
    navigation.navigate("Cart");
  }

  if (loading) {
    return (
      <Screen edges={["top", "bottom"]}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={palette.brand} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={["top"]} noPadding>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: layout.scrollBottomGuard + (cart.items.length > 0 ? 60 : 0),
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            tintColor={palette.brand}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* Top bar — address + bell + avatar always above the hero. */}
        <View style={{ paddingHorizontal: layout.screenPadding }}>
          <Header />
        </View>

        {/* Hero — sleek contained banner (sits inside screen padding). */}
        <View style={{ marginTop: spacing.xl }}>
          <HeroCarousel />
        </View>

        {/* Search — modern floating pill on white, below the hero (Zepto/Zomato pattern) */}
        <View style={{ paddingHorizontal: layout.screenPadding, marginTop: spacing.xl }}>
          <AnimatedSearchBar
            value={query}
            onChangeText={setQuery}
            hints={SEARCH_HINTS}
            inputRef={searchInputRef}
            onFilter={() => {}}
          />
        </View>

        {/* Categories — borderless circles, scrolls edge-to-edge */}
        <View style={{ marginTop: spacing.xl }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: layout.screenPadding,
              gap: spacing.lg,
            }}
          >
            <CategoryPill
              label="All"
              icon="grid"
              tone="catSand"
              selected={filter === "all"}
              onPress={() => setFilter("all")}
            />
            {categories.map((c) => {
              const meta = CATEGORY_META[c] || {
                label: browseCategories.find((x) => x.slug === c)?.name || c,
                icon: "circle",
                tone: "catSand",
              };
              return (
                <CategoryPill
                  key={c}
                  label={meta.label}
                  icon={meta.icon}
                  tone={meta.tone}
                  selected={filter === c}
                  onPress={() => setFilter(c)}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Featured — horizontal scroll, cards bleed off right edge */}
        {featured.length > 0 && (
          <>
            <View style={{ paddingHorizontal: layout.screenPadding }}>
              <SectionHeader title="Featured Sessions" actionLabel="View all" />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: layout.screenPadding,
                gap: spacing.md,
              }}
            >
              {featured.map((s) => (
                <FeaturedCard
                  key={s.id}
                  service={s}
                  fav={!!favorites[s.id]}
                  onPress={() => goToDetail(s)}
                  onToggleFav={() => toggleFav(s.id)}
                  onBook={() => bookNow(s)}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Trending — Top 3 numbered editorial + remaining flat rows */}
        {trending.length > 0 && (
          <View style={{ paddingHorizontal: layout.screenPadding, marginTop: spacing.sm }}>
            <SectionHeader title="Trending Now" actionLabel="View all" />
            <View>
              {/* Top 3 — numbered editorial style (chart vibe) */}
              {trending.slice(0, 3).map((s, i) => (
                <NumberedTrendingRow
                  key={s.id}
                  rank={i + 1}
                  service={s}
                  onPress={() => goToDetail(s)}
                  onBook={() => bookNow(s)}
                />
              ))}
              {/* Remaining (if any) — compact flat rows */}
              {trending.slice(3).map((s) => (
                <TrendingRow
                  key={s.id}
                  service={s}
                  onPress={() => goToDetail(s)}
                  onBook={() => bookNow(s)}
                />
              ))}
            </View>
          </View>
        )}

        {visible.length === 0 && (
          <View style={{ alignItems: "center", paddingTop: 40 }}>
            <Feather name="search" size={26} color={palette.textMuted} />
            <Text variant="h3" color="secondary" style={{ marginTop: spacing.md }}>
              No matches
            </Text>
            <Text variant="bodySm" color="muted">Try a different search or category.</Text>
          </View>
        )}
      </ScrollView>

      {cart.items.length > 0 && (
        <CartBar
          count={cart.count}
          duration={cart.duration}
          total={cart.total}
          onPress={() => navigation.navigate("Cart")}
        />
      )}

      <BottomNav active="home" />
    </Screen>
  );
}

/* ============================================================
 * Header
 * ============================================================ */

function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: spacing.sm,
      }}
    >
      {/* Location pill — Zepto/Zomato style. Tappable, tells the user "where" they are. */}
      <Pressable
        hitSlop={6}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View
          style={{
            width: 32, height: 32, borderRadius: 16,
            backgroundColor: palette.surfaceWarm,
            alignItems: "center", justifyContent: "center",
            marginRight: spacing.sm,
          }}
        >
          <Feather name="map-pin" size={14} color={palette.brand} />
        </View>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text variant="bodySmMd" style={{ marginRight: 2 }}>Home</Text>
            <Feather name="chevron-down" size={14} color={palette.textPrimary} />
          </View>
          <Text variant="caption" color="muted" numberOfLines={1} style={{ maxWidth: 180 }}>
            Civil Lines, Allahabad
          </Text>
        </View>
      </Pressable>

      {/* Right: notification bell + avatar */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          hitSlop={6}
          style={({ pressed }) => ({
            width: 38, height: 38, borderRadius: 19,
            backgroundColor: palette.surface,
            borderWidth: 1, borderColor: palette.hairline,
            alignItems: "center", justifyContent: "center",
            marginRight: spacing.sm,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Feather name="bell" size={16} color={palette.textPrimary} />
          <View
            style={{
              position: "absolute", top: 8, right: 9,
              width: 7, height: 7, borderRadius: 4,
              backgroundColor: palette.heart,
              borderWidth: 1.5, borderColor: palette.surface,
            }}
          />
        </Pressable>
        <Avatar
          uri="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80"
          name="You"
          size={38}
        />
      </View>
    </View>
  );
}

/* ============================================================
 * CategoryPill — no card wrap, just colored circle + label
 * ============================================================ */

function CategoryPill({ label, icon, tone = "catSand", selected, onPress }) {
  const t = palette[tone] || palette.catSand;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({
        alignItems: "center",
        width: 64,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: selected ? palette.brand : t.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather
          name={icon}
          size={20}
          color={selected ? palette.textOnBrand : t.fg}
        />
      </View>
      <Text
        variant="bodySm"
        color={selected ? "ink" : "primary"}
        numberOfLines={1}
        style={{
          marginTop: spacing.sm,
          textAlign: "center",
          fontWeight: selected ? "600" : "400",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ============================================================
 * FeaturedCard — editorial photo card with content overlaid.
 *
 * The photo IS the card. A bottom-up gradient creates legibility;
 * title / meta / price / Book pill all live on the photo. The
 * bookmark floats top-right. No floating text below — the card is
 * one unified visual surface.
 * ============================================================ */

function FeaturedCard({ service, fav, onPress, onToggleFav, onBook }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: FEATURED_CARD_W,
        height: FEATURED_CARD_H,
        opacity: pressed ? 0.97 : 1,
      })}
    >
      <View
        style={{
          flex: 1,
          borderRadius: radii.xxl,
          overflow: "hidden",
          backgroundColor: palette.surfaceWarm,
        }}
      >
        {/* Full-bleed photo */}
        <Image
          source={{ uri: service.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        {/* Bottom-up gradient — covers ~70% so the photo still breathes up top */}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(20,12,8,0.55)", "rgba(20,12,8,0.92)"]}
          locations={[0, 0.55, 1]}
          style={{
            position: "absolute",
            left: 0, right: 0, bottom: 0,
            height: "70%",
          }}
        />

        {/* Bookmark — frosted white circle, top-right */}
        <Pressable
          onPress={onToggleFav}
          hitSlop={6}
          style={({ pressed }) => ({
            position: "absolute",
            top: spacing.md,
            right: spacing.md,
            width: 34, height: 34, borderRadius: 17,
            backgroundColor: "rgba(255,255,255,0.95)",
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Feather
            name="bookmark"
            size={14}
            color={fav ? palette.brand : palette.textPrimary}
          />
        </Pressable>

        {/* Category eyebrow — top-left, very small, sets the context */}
        <View
          style={{
            position: "absolute",
            top: spacing.md,
            left: spacing.md,
            backgroundColor: "rgba(255,255,255,0.18)",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: radii.pill,
          }}
        >
          <Text
            variant="caption"
            style={{ color: "#FFFFFF", fontSize: 10, letterSpacing: 0.3 }}
          >
            {prettyTag(service.skillTag).toUpperCase()}
          </Text>
        </View>

        {/* Content overlay — bottom of the photo */}
        <View
          style={{
            position: "absolute",
            left: 0, right: 0, bottom: 0,
            padding: spacing.md,
          }}
        >
          {/* Title */}
          <Text
            numberOfLines={1}
            style={{
              color: "#FFFFFF",
              fontSize: 17,
              lineHeight: 21,
              fontWeight: "700",
            }}
          >
            {service.name}
          </Text>

          {/* Meta row — duration · rating */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
            <Feather name="clock" size={10} color="rgba(255,255,255,0.85)" />
            <Text
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              {service.durationMin} min
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.55)", marginHorizontal: 6, fontSize: 11 }}>·</Text>
            <Feather name="star" size={10} color={palette.gold} />
            <Text
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 11,
                marginLeft: 3,
              }}
            >
              {(service.rating || 4.8).toFixed(1)}
            </Text>
          </View>

          {/* Price + Book pill */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: spacing.md,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 19, fontWeight: "700" }}>
                ₹{service.price}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginLeft: 3 }}>
                /session
              </Text>
            </View>
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); onBook?.(); }}
              hitSlop={6}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: radii.pill,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                style={{ color: palette.brand, fontSize: 12, fontWeight: "600" }}
              >
                Book
              </Text>
              <Feather
                name="arrow-right"
                size={11}
                color={palette.brand}
                style={{ marginLeft: 4 }}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/* ============================================================
 * NumberedTrendingRow — editorial "Top 3" chart style.
 *
 * Big mocha rank number on the left (01 / 02 / 03), 88px square
 * photo in the middle, then title → meta → price + Book pill on
 * the right. No card chrome — the rank number does the visual work.
 * ============================================================ */

function NumberedTrendingRow({ rank, service, onPress, onBook }) {
  const rankStr = String(rank).padStart(2, "0");
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.lg,
        opacity: pressed ? 0.95 : 1,
      })}
    >
      {/* Rank number — italic serif, editorial / luxury-magazine feel.
       *
       * Why serif italic: bold sans-serif reads as "data" (Bloomberg, Excel);
       * italic serif reads as "curated" (Vogue, Condé Nast, NYT Magazine).
       * Pairs better with a wellness/luxury brand than the default chart number. */}
      <View
        style={{
          width: 56,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }),
            fontStyle: "italic",
            fontWeight: "700",
            fontSize: 46,
            lineHeight: 50,
            color: palette.brand,
            letterSpacing: -1.5,
            includeFontPadding: false,
          }}
        >
          {rankStr}
        </Text>
        {/* Thin mocha accent line — adds editorial framing without chrome. */}
        <View
          style={{
            width: 18,
            height: 1.5,
            backgroundColor: palette.brand,
            marginTop: 6,
            opacity: 0.55,
          }}
        />
      </View>

      {/* Photo */}
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: radii.xl,
          overflow: "hidden",
          backgroundColor: palette.surfaceWarm,
          marginLeft: spacing.sm,
          marginRight: spacing.md,
        }}
      >
        <Image
          source={{ uri: service.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text variant="bodyMd" numberOfLines={1} style={{ fontWeight: "700" }}>
          {service.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
          <Feather name="star" size={11} color={palette.gold} />
          <Text variant="bodySmMd" style={{ marginLeft: 4 }}>
            {(service.rating || 4.8).toFixed(1)}
          </Text>
          <Text variant="bodySm" color="muted" style={{ marginLeft: 6 }}>
            · {prettyTag(service.skillTag)} · {service.durationMin} min
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: spacing.sm,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={{ color: palette.brand, fontSize: 16, fontWeight: "700" }}>
              ₹{service.price}
            </Text>
            <Text variant="bodySm" color="muted" style={{ marginLeft: 3 }}>
              /session
            </Text>
          </View>
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onBook?.(); }}
            hitSlop={6}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: palette.brand,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: radii.pill,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text variant="bodySmMd" style={{ color: palette.textOnBrand }}>
              Book
            </Text>
            <Feather
              name="arrow-right"
              size={11}
              color={palette.textOnBrand}
              style={{ marginLeft: 4 }}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

/* ============================================================
 * TrendingRow — flat list row, no card bg, Apple-Music style.
 * Used for items beyond rank 3.
 * ============================================================ */

function TrendingRow({ service, onPress, onBook }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 76,
          height: 76,
          borderRadius: radii.xl,
          overflow: "hidden",
          backgroundColor: palette.surfaceWarm,
          marginRight: spacing.md,
        }}
      >
        <Image
          source={{ uri: service.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
          <Feather name="star" size={11} color={palette.gold} />
          <Text variant="bodySmMd" style={{ marginLeft: 4 }}>
            {(service.rating || 4.8).toFixed(1)}
          </Text>
          <Text variant="bodySm" color="muted" style={{ marginLeft: 6 }}>
            · {prettyTag(service.skillTag)} · {service.durationMin} min
          </Text>
        </View>
        <Text variant="bodyMd" numberOfLines={1}>
          {service.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text variant="price" style={{ color: palette.brand }}>
            ₹{service.price}
            <Text variant="bodySm" color="muted">/session</Text>
          </Text>
          <Pressable
            onPress={onBook}
            hitSlop={6}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: palette.brand,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: radii.pill,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text variant="bodySmMd" style={{ color: palette.textOnBrand }}>
              Book
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function prettyTag(tag) {
  if (!tag) return "Massage";
  return tag
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ============================================================
 * CartBar — floating brown pill, sits above the flat bottom nav
 * ============================================================ */

function CartBar({ count, duration, total, onPress }) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: layout.screenPadding,
        right: layout.screenPadding,
        bottom: layout.bottomNavHeight + 12 + 16,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: palette.brand,
          borderRadius: radii.pill,
          paddingVertical: 12,
          paddingHorizontal: spacing.lg,
          opacity: pressed ? 0.95 : 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 6,
        })}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: palette.gold,
              alignItems: "center", justifyContent: "center",
              marginRight: spacing.md,
            }}
          >
            <Text variant="caption" style={{ color: palette.brandDeep }}>{count}</Text>
          </View>
          <Text variant="bodyMd" style={{ color: palette.textOnBrand }}>
            {duration} min · ₹{total}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text variant="button" style={{ color: palette.textOnBrand, marginRight: 6 }}>
            Review
          </Text>
          <Feather name="arrow-right" size={16} color={palette.textOnBrand} />
        </View>
      </Pressable>
    </View>
  );
}
