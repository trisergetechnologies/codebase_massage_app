import React from "react";
import { TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Text } from "./Text";
import { palette, radii, spacing } from "../theme/tokens";

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style,
}) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isDanger && styles.danger,
        variant === "ghost" && styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#0a0d12" : palette.text} />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary && styles.labelPrimary,
            isDanger && styles.labelDanger,
            variant === "ghost" && styles.labelGhost,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: palette.accent },
  danger: { backgroundColor: palette.danger },
  ghost: {
    backgroundColor: palette.card2,
    borderWidth: 1,
    borderColor: palette.border,
  },
  disabled: { opacity: 0.55 },
  label: { fontSize: 15, fontWeight: "800" },
  labelPrimary: { color: "#0a0d12" },
  labelDanger: { color: "#fff" },
  labelGhost: { color: palette.text },
});
