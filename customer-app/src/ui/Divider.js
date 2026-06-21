import React from "react";
import { View } from "react-native";
import { palette, spacing } from "../theme/tokens";

export default function Divider({ vertical = false, my = spacing.md, mx = 0 }) {
  return (
    <View
      style={
        vertical
          ? { width: 1, alignSelf: "stretch", backgroundColor: palette.hairline, marginHorizontal: mx }
          : { height: 1, alignSelf: "stretch", backgroundColor: palette.hairline, marginVertical: my }
      }
    />
  );
}
