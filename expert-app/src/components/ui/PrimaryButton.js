import React from "react";
import { TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../../theme/tokens";
import { AppText } from "./AppText";

export function PrimaryButton({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style,
}) {
  const isOutline = variant === "outline";
  const isDanger = variant === "danger";
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        isOutline && styles.outline,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : "#fff"} />
      ) : (
        <AppText
          style={[
            styles.label,
            isOutline && styles.labelOutline,
            isDanger && styles.labelDanger,
          ]}
        >
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primaryBtn,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: "center",
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.5 },
  label: { color: colors.primaryBtnText, fontWeight: "700", fontSize: 15 },
  labelOutline: { color: colors.text },
  labelDanger: { color: "#fff" },
});
