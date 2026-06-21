import React from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import Text from "./Text";
import { palette, radii, spacing, shadows } from "../theme/tokens";

/**
 * CategoryIcon — the small "Top Services" tile.
 *
 *   ┌──────────┐
 *   │   ◉      │   tinted square (white) with pastel-icon centre
 *   └──────────┘
 *      Label
 *
 * The tint is selected by `tone` (one of the `palette.cat*` themes) so a
 * row of these renders as a subtle rainbow of pastels — no two tiles look
 * the same colour, but everything reads as one family.
 */
const TONES = ["catBlush", "catOlive", "catSky", "catLilac", "catSand"];

export default function CategoryIcon({ icon = "feather", label, toneIndex = 0, onPress, selected = false }) {
  const tone = palette[TONES[toneIndex % TONES.length]];
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({
        alignItems: "center",
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        style={[
          {
            width: 64,
            height: 64,
            borderRadius: radii.xl,
            backgroundColor: palette.surface,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: selected ? 2 : 0,
            borderColor: palette.brand,
          },
          shadows.sm,
        ]}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: tone.bg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name={icon} size={18} color={tone.fg} />
        </View>
      </View>
      <Text
        variant="bodySm"
        color="primary"
        numberOfLines={1}
        style={{ marginTop: spacing.sm, maxWidth: 80, textAlign: "center" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
