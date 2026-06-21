import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Text from "./Text";
import { palette, radii, spacing } from "../theme/tokens";

/**
 * Chip — pill used for category filters, tags, status indicators.
 *
 *   default   white surface, hairline border, ink text   (unselected category)
 *   selected  soft peach fill, no border, ink text       (selected category)
 *   ink       solid black, white text                    (rare CTA-y chip)
 *   purple    purple-tinted soft fill                    (promo tag)
 *   gold      gold-tinted soft fill                      (rating highlight)
 *   success / danger as expected.
 */
const VARIANTS = {
  default:  { bg: palette.surface, fg: palette.ink, border: palette.hairline },
  selected: { bg: palette.peach, fg: palette.ink, border: "transparent" },
  ink:      { bg: palette.ink, fg: palette.textOnInk, border: "transparent" },
  purple:   { bg: palette.purpleSoft, fg: palette.purpleDeep, border: "transparent" },
  gold:     { bg: palette.goldSoft, fg: palette.goldDeep, border: "transparent" },
  success:  { bg: palette.successSoft, fg: palette.success, border: "transparent" },
  danger:   { bg: palette.dangerSoft, fg: palette.danger, border: "transparent" },
};

export default function Chip({
  label,
  variant = "default",
  leftIcon,
  rightIcon,
  onPress,
  style,
}) {
  const v = VARIANTS[variant] || VARIANTS.default;
  const Wrap = onPress ? Pressable : View;
  return (
    <Wrap onPress={onPress} style={({ pressed }) => [
      styles.chip,
      {
        backgroundColor: v.bg,
        borderColor: v.border,
        borderWidth: v.border === "transparent" ? 0 : 1,
        opacity: pressed ? 0.9 : 1,
      },
      style,
    ]}>
      {leftIcon ? <View style={{ marginRight: 6 }}>{leftIcon}</View> : null}
      <Text variant="bodySmMd" style={{ color: v.fg }}>{label}</Text>
      {rightIcon ? <View style={{ marginLeft: 6 }}>{rightIcon}</View> : null}
    </Wrap>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.pill,
    alignSelf: "flex-start",
  },
});
