import React from "react";
import { View, Pressable } from "react-native";
import Text from "./Text";
import { spacing } from "../theme/tokens";

/**
 * SectionHeader — used above lists. Optional right-side action ("See all").
 *
 *   <SectionHeader title="Top rated" actionLabel="See all" onAction={...} />
 */
export default function SectionHeader({ title, subtitle, actionLabel, onAction, style }) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginTop: spacing.xxl,
          marginBottom: spacing.md,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <Text variant="h2">{title}</Text>
        {subtitle ? (
          <Text variant="bodySm" color="secondary" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="bodySmMd" color="ink">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
