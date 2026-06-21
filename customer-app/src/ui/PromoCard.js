import React from "react";
import { View, ImageBackground, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import Text from "./Text";
import Button from "./Button";
import { palette, radii, spacing, shadows } from "../theme/tokens";

/**
 * PromoCard — the editorial promo block.
 *
 * Layout:
 *   ┌──────────────────────────────────────────┐
 *   │ ░░ purple block ░░░ │  photographic      │
 *   │  Headline           │  imagery           │
 *   │  Subline            │  (sun-burst /      │
 *   │  [Black pill CTA]   │   product / etc)   │
 *   └──────────────────────────────────────────┘
 *
 * The purple covers ~62% of the width and fades into the photo via a
 * horizontal gradient. The CTA is a tight black pill — "Buy" / "View".
 */
export default function PromoCard({
  imageUri,
  caption,
  headline,
  subheadline,
  ctaLabel = "View",
  height = 150,
  onPress,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderRadius: radii.xxl,
          overflow: "hidden",
          opacity: pressed ? 0.96 : 1,
        },
        shadows.md,
        style,
      ]}
    >
      <ImageBackground
        source={imageUri ? { uri: imageUri } : undefined}
        style={{ width: "100%", height, backgroundColor: palette.purple }}
        imageStyle={{ borderRadius: radii.xxl }}
      >
        {/* Decorative sunburst pattern overlay (pure CSS-style with gradient). */}
        <LinearGradient
          colors={["rgba(123, 107, 140, 0.0)", "rgba(123, 107, 140, 0.35)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}
        />

        {/* Purple-block-on-left gradient — the workhorse for legibility. */}
        <LinearGradient
          colors={["rgba(92, 77, 110, 0.96)", "rgba(123, 107, 140, 0.85)", "rgba(123, 107, 140, 0.0)"]}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}
        />

        {/* Content anchored centre-left. */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingLeft: spacing.xl,
            paddingRight: spacing.xl,
            maxWidth: "70%",
          }}
        >
          {caption ? (
            <Text variant="caption" style={{ color: palette.textOnPurple, opacity: 0.85 }}>
              {caption}
            </Text>
          ) : null}
          <Text variant="promoHero" style={{ color: palette.textOnPurple, marginTop: caption ? 4 : 0 }}>
            {headline}
          </Text>
          {subheadline ? (
            <Text
              variant="bodySm"
              style={{ color: palette.textOnPurple, opacity: 0.85, marginTop: 4 }}
              numberOfLines={2}
            >
              {subheadline}
            </Text>
          ) : null}
          <View style={{ height: spacing.md }} />
          <View style={{ alignSelf: "flex-start" }}>
            <Button
              title={ctaLabel}
              variant="primary"
              size="sm"
              onPress={onPress}
              rightIcon={<Feather name="arrow-up-right" size={14} color={palette.textOnInk} />}
            />
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}
