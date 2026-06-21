import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../../theme/tokens";

export function OTPInput({ value, onChangeText, length = 4 }) {
  return (
    <TextInput
      value={value}
      onChangeText={(t) => onChangeText(t.replace(/\D/g, "").slice(0, length))}
      keyboardType="number-pad"
      maxLength={length}
      placeholder={"0".repeat(length)}
      placeholderTextColor={colors.textMuted}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.lg,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 12,
    color: colors.text,
  },
});
