import React from "react";
import { View } from "react-native";
import Text from "./Text";
import { palette, radii, spacing } from "../theme/tokens";

const LABELS = {
  awaiting_payment: "Payment pending",
  created: "Requested",
  searching: "Finding expert",
  assigned: "Expert assigned",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

/**
 * Booking status pill. Always reads from `palette.status[key]` so changing
 * the colors in tokens propagates everywhere.
 */
export default function StatusBadge({ status, size = "md" }) {
  const colors = palette.status[status] || { bg: palette.surfaceSoft, fg: palette.textSecondary };
  const label = LABELS[status] || status;
  const pad = size === "sm" ? { paddingHorizontal: 8, paddingVertical: 3 } : { paddingHorizontal: 10, paddingVertical: 5 };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.bg,
        borderRadius: radii.pill,
        alignSelf: "flex-start",
        ...pad,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          backgroundColor: colors.fg,
          marginRight: 6,
        }}
      />
      <Text variant={size === "sm" ? "caption" : "bodySmMd"} style={{ color: colors.fg }}>
        {label}
      </Text>
    </View>
  );
}
