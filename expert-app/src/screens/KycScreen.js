import React, { useState } from "react";
import { View, TextInput, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpertSession } from "../context/ExpertSessionContext";
import { expertService } from "../services/expertService";
import { colors, spacing, radii } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { PrimaryButton } from "../components/ui/PrimaryButton";

const LABELS = {
  pending: "Not submitted",
  submitted: "Under review",
  verified: "Verified",
  rejected: "Needs update",
};

export default function KycScreen() {
  const { me, refreshMe } = useExpertSession();
  const [note, setNote] = useState(me?.kycNote || "");
  const [busy, setBusy] = useState(false);
  const status = me?.kycStatus || "pending";

  async function submit() {
    setBusy(true);
    try {
      await expertService.submitKyc(note.trim());
      await refreshMe();
      Alert.alert("Submitted", "Our team will verify your documents within 24–48 hours.");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="h1">KYC & profile</AppText>
        <AppText variant="body" color="secondary" style={{ marginTop: spacing.sm }}>
          Status: {LABELS[status] || status}
        </AppText>
        {status !== "verified" && (
          <>
            <AppText variant="caption" color="secondary" style={{ marginTop: spacing.xl }}>
              ID / notes for verification team
            </AppText>
            <TextInput
              value={note}
              onChangeText={setNote}
              multiline
              placeholder="Aadhaar last 4 digits, document refs…"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { minHeight: 100 }]}
            />
            <PrimaryButton
              title={busy ? "Submitting…" : "Submit for verification"}
              onPress={submit}
              disabled={busy || status === "submitted"}
              style={{ marginTop: spacing.xl }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xl },
  input: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
    textAlignVertical: "top",
  },
});
