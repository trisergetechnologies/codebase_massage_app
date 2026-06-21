import React from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import Text from "./Text";
import { palette, radii, spacing } from "../theme/tokens";

/**
 * QtyStepper — the segmented [-] N [+] control used in cart rows and
 * potentially other quantity contexts.
 *
 * Two compact circular buttons flanking a centered numeral. Soft surface
 * background; the stepper itself sits on a hairline outline so it reads as
 * a unit but stays understated.
 */
export default function QtyStepper({ value, onMinus, onPlus, min = 1, max = 99 }) {
  const canDec = value > min;
  const canInc = value < max;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: palette.surface,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: palette.hairlineSoft,
        paddingHorizontal: 4,
        paddingVertical: 4,
        gap: 4,
      }}
    >
      <Pressable
        hitSlop={4}
        onPress={canDec ? onMinus : undefined}
        style={({ pressed }) => ({
          width: 28, height: 28, borderRadius: 14,
          backgroundColor: palette.surfaceSoft,
          alignItems: "center", justifyContent: "center",
          opacity: pressed ? 0.7 : canDec ? 1 : 0.4,
        })}
      >
        <Feather name="minus" size={14} color={palette.ink} />
      </Pressable>

      <Text variant="bodyMd" style={{ width: 22, textAlign: "center" }}>{value}</Text>

      <Pressable
        hitSlop={4}
        onPress={canInc ? onPlus : undefined}
        style={({ pressed }) => ({
          width: 28, height: 28, borderRadius: 14,
          backgroundColor: palette.ink,
          alignItems: "center", justifyContent: "center",
          opacity: pressed ? 0.7 : canInc ? 1 : 0.4,
        })}
      >
        <Feather name="plus" size={14} color={palette.textOnInk} />
      </Pressable>
    </View>
  );
}
