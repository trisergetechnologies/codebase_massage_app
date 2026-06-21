import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, Dimensions, Pressable, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import Text from "./Text";
import { palette, radii, spacing, layout } from "../theme/tokens";

/**
 * HeroCarousel — sleek, contained, photographic banner.
 *
 * Lives inside `screenPadding` with rounded corners — feels like a
 * Zepto/Zomato hero card, not a magazine cover. Auto-rotates every
 * AUTO_PLAY_MS; pauses for 6s after manual swipe.
 *
 *   ┌────────────────────────────────────────┐
 *   │                                        │
 *   │   📦 Limited offer                     │
 *   │   Flat 25% off                         │
 *   │   On your first massage at home        │
 *   │                                        │
 *   │   [ Claim now → ]            ·· ─      │
 *   └────────────────────────────────────────┘
 */
const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDE_WIDTH = SCREEN_WIDTH - 2 * layout.screenPadding;
const SLIDE_HEIGHT = 168;
const AUTO_PLAY_MS = 4500;

const DEFAULT_SLIDES = [
  {
    id: "discount-25",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=80",
    eyebrow: "Limited offer",
    title: "Flat 25% off",
    subtitle: "On your first home massage",
    cta: "Claim now",
    icon: "gift",
  },
  {
    id: "couples",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&q=80",
    eyebrow: "New",
    title: "Couples therapy",
    subtitle: "Book 2 sessions, save 30%",
    cta: "Try together",
    icon: "heart",
  },
  {
    id: "premium",
    image: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1400&q=80",
    eyebrow: "Premium ritual",
    title: "Hot stones & aroma",
    subtitle: "All-inclusive 90-min ritual",
    cta: "Discover",
    icon: "star",
  },
];

export default function HeroCarousel({ slides = DEFAULT_SLIDES, onPress, height = SLIDE_HEIGHT }) {
  const [idx, setIdx] = useState(0);
  const listRef = useRef(null);
  const userInteractedAt = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - userInteractedAt.current < 6000) return;
      setIdx((curr) => {
        const next = (curr + 1) % slides.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <View
      style={{
        height,
        marginHorizontal: layout.screenPadding,
        borderRadius: radii.xxl,
        overflow: "hidden",
      }}
    >
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.id}
        getItemLayout={(_, index) => ({
          length: SLIDE_WIDTH,
          offset: SLIDE_WIDTH * index,
          index,
        })}
        onScrollBeginDrag={() => { userInteractedAt.current = Date.now(); }}
        onMomentumScrollEnd={(e) => {
          const newIdx = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
          setIdx(newIdx);
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onPress?.(item)}
            style={({ pressed }) => ({
              width: SLIDE_WIDTH,
              height,
              opacity: pressed ? 0.97 : 1,
            })}
          >
            <ImageBackground
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            >
              {/* Lighter gradient — sleek, not heavy. Photo still breathes through. */}
              <LinearGradient
                colors={["rgba(20,12,8,0.05)", "rgba(20,12,8,0.45)", "rgba(20,12,8,0.78)"]}
                locations={[0, 0.55, 1]}
                style={{
                  flex: 1,
                  paddingHorizontal: spacing.lg,
                  paddingBottom: spacing.md,
                  paddingTop: spacing.md,
                  justifyContent: "flex-end",
                }}
              >
                {/* Eyebrow — small, tasteful */}
                <View
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.16)",
                    borderRadius: radii.pill,
                    paddingHorizontal: 9,
                    paddingVertical: 4,
                    marginBottom: 6,
                  }}
                >
                  <Feather name={item.icon} size={10} color="#FFFFFF" />
                  <Text
                    variant="caption"
                    style={{ color: "#FFFFFF", marginLeft: 4, fontSize: 10, letterSpacing: 0.2 }}
                  >
                    {item.eyebrow}
                  </Text>
                </View>

                {/* Title — sized down, single line where possible */}
                <Text
                  variant="h1"
                  numberOfLines={1}
                  style={{ color: "#FFFFFF", fontSize: 22, lineHeight: 26 }}
                >
                  {item.title}
                </Text>
                <Text
                  variant="bodySm"
                  numberOfLines={1}
                  style={{ color: "#FFFFFF", opacity: 0.92, marginTop: 2 }}
                >
                  {item.subtitle}
                </Text>

                {/* CTA + dots row — tightened */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: spacing.md,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#FFFFFF",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: radii.pill,
                    }}
                  >
                    <Text
                      variant="bodySmMd"
                      style={{ color: palette.brand, fontSize: 12 }}
                    >
                      {item.cta}
                    </Text>
                    <Feather
                      name="arrow-right"
                      size={11}
                      color={palette.brand}
                      style={{ marginLeft: 4 }}
                    />
                  </View>

                  {/* Dots — slim, the active one stretches to a bar */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    {slides.map((s, i) => (
                      <View
                        key={s.id}
                        style={{
                          width: i === idx ? 14 : 5,
                          height: 5,
                          borderRadius: 2.5,
                          backgroundColor: i === idx ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                        }}
                      />
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </Pressable>
        )}
      />
    </View>
  );
}
