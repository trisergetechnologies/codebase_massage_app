import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing } from "../../theme/tokens";
import { AppText } from "../ui/AppText";
import { PrimaryButton } from "../ui/PrimaryButton";

export function EmptyState({ icon = "inbox", title, message, actionLabel, onAction }) {
  return (
    <View style={styles.wrap}>
      <Feather name={icon} size={40} color={colors.textMuted} />
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" color="secondary" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} onPress={onAction} style={{ marginTop: spacing.lg }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  title: { marginTop: spacing.lg, textAlign: "center" },
  message: { marginTop: spacing.sm, textAlign: "center", lineHeight: 22 },
});
