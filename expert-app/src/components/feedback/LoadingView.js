import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors, spacing } from "../../theme/tokens";
import { AppText } from "../ui/AppText";

export function LoadingView({ message = "Loading…" }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText variant="caption" style={{ marginTop: spacing.md }}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
});
