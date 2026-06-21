import React from "react";
import { View, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import Text from "./Text";
import Card from "./Card";
import Button from "./Button";
import { palette, radii, spacing } from "../theme/tokens";

/**
 * NearYouCard — full-width horizontal service card.
 *
 *   ┌─────┬───────────────────────────────────┐
 *   │     │  ★ 4.8           · 47 nearby      │
 *   │ img │  Service name                     │
 *   │     │  Sub label                        │
 *   │     │  ₹price                  [ Book ] │
 *   └─────┴───────────────────────────────────┘
 */
export default function NearYouCard({
  imageUri,
  title,
  subtitle,
  price,
  rating = 4.8,
  meta = "Nearby",
  onPress,
  onBook,
}) {
  return (
    <Card padding={spacing.md} radius={radii.xxl} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: radii.lg,
            overflow: "hidden",
            backgroundColor: palette.surfaceWarm,
            marginRight: spacing.md,
          }}
        >
          <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        </View>

        <View style={{ flex: 1 }}>
          {/* Top meta row */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="star" size={12} color={palette.gold} />
              <Text variant="bodySmMd" style={{ marginLeft: 4 }}>{rating.toFixed(1)}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="map-pin" size={11} color={palette.textMuted} />
              <Text variant="bodySm" color="muted" style={{ marginLeft: 4 }}>{meta}</Text>
            </View>
          </View>

          {/* Title + subtitle */}
          <Text variant="h3" numberOfLines={1} style={{ marginTop: 4 }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="bodySm" color="muted" numberOfLines={1} style={{ marginTop: 2 }}>
              {subtitle}
            </Text>
          ) : null}

          {/* Bottom: price + Book pill */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: spacing.sm,
            }}
          >
            <Text variant="price">{price}</Text>
            <Button title="Book" size="sm" onPress={onBook} />
          </View>
        </View>
      </View>
    </Card>
  );
}
