import React from "react";
import { Pressable, ActivityIndicator, View, StyleSheet } from "react-native";
import Text from "./Text";
import { palette, radii, spacing, shadows } from "../theme/tokens";

/**
 * Button — the only button component in the app. Variants:
 *   primary   solid black ink (brand CTA — "Add to cart", "Continue")
 *   purple    dusty purple (rare promo CTA)
 *   ghost     transparent with hairline border (tertiary)
 *   subtle    soft surface fill (quiet action)
 *   danger    deep red, for destructive
 *
 * Sizes: lg (default, 56pt), md (48pt), sm (38pt). All pill-shaped.
 *
 * Press feedback: slight inward scale + opacity dip — feels buttery,
 * not jarring like a sudden color flash.
 */

const SIZES = {
  lg: { height: 56, paddingHorizontal: 28, fontSize: 16 },
  md: { height: 48, paddingHorizontal: 22, fontSize: 15 },
  sm: { height: 38, paddingHorizontal: 16, fontSize: 13 },
};

function colorsForVariant(variant, pressed, disabled) {
  if (disabled) {
    return { bg: palette.surfaceSoft, fg: palette.textMuted, border: "transparent" };
  }
  switch (variant) {
    case "purple":
      return { bg: pressed ? palette.purpleDeep : palette.purple, fg: palette.textOnPurple, border: "transparent" };
    case "ghost":
      return { bg: pressed ? palette.surfaceSoft : "transparent", fg: palette.ink, border: palette.hairline };
    case "subtle":
      return { bg: pressed ? palette.hairline : palette.surface, fg: palette.ink, border: "transparent" };
    case "danger":
      return { bg: pressed ? "#9C2E1F" : palette.danger, fg: "#FFFFFF", border: "transparent" };
    case "primary":
    default:
      return { bg: pressed ? palette.inkPressed : palette.ink, fg: palette.textOnInk, border: "transparent" };
  }
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  style,
}) {
  const sz = SIZES[size] || SIZES.lg;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => {
        const c = colorsForVariant(variant, pressed, disabled || loading);
        return [
          styles.base,
          {
            height: sz.height,
            paddingHorizontal: sz.paddingHorizontal,
            backgroundColor: c.bg,
            borderColor: c.border,
            borderWidth: c.border === "transparent" ? 0 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
            width: fullWidth ? "100%" : undefined,
          },
          variant === "primary" && !disabled && !loading && shadows.md,
          style,
        ];
      }}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" || variant === "purple" || variant === "danger" ? "#FFFFFF" : palette.ink} />
      ) : (
        <View style={styles.row}>
          {leftIcon ? <View style={{ marginRight: spacing.sm }}>{leftIcon}</View> : null}
          <Text
            variant="button"
            style={{
              color: colorsForVariant(variant, false, disabled || loading).fg,
              fontSize: sz.fontSize,
            }}
          >
            {title}
          </Text>
          {rightIcon ? <View style={{ marginLeft: spacing.sm }}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
