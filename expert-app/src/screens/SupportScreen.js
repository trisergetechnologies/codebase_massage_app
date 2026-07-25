import React from "react";
import { ScrollView, StyleSheet, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { PrimaryButton } from "../components/ui/PrimaryButton";

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="h1">Support</AppText>
        <AppText variant="body" color="secondary" style={{ marginTop: spacing.md }}>
          Reach our operations team for payout, safety, or account issues.
        </AppText>
        <PrimaryButton
          title="Email ops@codebasemassage.com"
          onPress={() => Linking.openURL("mailto:ops@codebasemassage.com")}
          style={{ marginTop: spacing.xxl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xl },
});
