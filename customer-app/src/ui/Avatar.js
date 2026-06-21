import React from "react";
import { View, Image } from "react-native";
import Text from "./Text";
import { palette } from "../theme/tokens";

/**
 * Circular avatar with image fallback to initials on a peach-tinted bg.
 */
export default function Avatar({ uri, name = "", size = 44, style }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  if (uri) {
    return <Image source={{ uri }} style={[{ width: size, height: size, borderRadius: size / 2 }, style]} />;
  }
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.peachSoft,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text variant="h3" style={{ color: palette.peachDeep }}>{initials || "?"}</Text>
    </View>
  );
}
