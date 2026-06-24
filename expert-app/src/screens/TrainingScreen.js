import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpertSession } from "../context/ExpertSessionContext";
import { expertService } from "../services/expertService";
import { colors, spacing } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { PrimaryButton } from "../components/ui/PrimaryButton";

const STEPS = [
  { key: "pending", label: "Introduction" },
  { key: "in_progress", label: "Hands-on modules" },
  { key: "completed", label: "Certification" },
];

export default function TrainingScreen() {
  const { me, refreshMe } = useExpertSession();
  const [busy, setBusy] = useState(false);
  const status = me?.trainingStatus || "pending";

  async function advance() {
    const next =
      status === "pending" ? "in_progress" : status === "in_progress" ? "completed" : null;
    if (!next) return;
    setBusy(true);
    try {
      await expertService.updateTraining(next);
      await refreshMe();
      Alert.alert("Progress saved", next === "completed" ? "Training complete!" : "Keep going!");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="h1">Partner training</AppText>
        <AppText variant="body" color="secondary" style={{ marginTop: spacing.sm }}>
          Complete all modules before taking live jobs in production.
        </AppText>
        {STEPS.map((s, i) => {
          const done =
            (status === "in_progress" && i === 0) ||
            (status === "completed" && i <= 1) ||
            (status === "completed" && s.key === "completed");
          const current = s.key === status;
          return (
            <View key={s.key} style={[styles.step, current && styles.stepCurrent]}>
              <AppText variant="bodyMd">{s.label}</AppText>
              <AppText variant="caption" color="secondary">
                {done && !current ? "Done" : current ? "In progress" : "Locked"}
              </AppText>
            </View>
          );
        })}
        {status !== "completed" && (
          <PrimaryButton
            title={busy ? "Saving…" : status === "pending" ? "Start training" : "Mark complete"}
            onPress={advance}
            disabled={busy}
            style={{ marginTop: spacing.xxl }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xl },
  step: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  stepCurrent: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
});
