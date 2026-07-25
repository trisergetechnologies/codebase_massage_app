import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../services/authService";
import { setTokens } from "../services/apiClient";
import { colors, spacing, radii } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { PrimaryButton } from "../components/ui/PrimaryButton";

export default function LoginScreen({ onAuthed }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [stage, setStage] = useState("phone");
  const [busy, setBusy] = useState(false);

  async function sendOtp() {
    setBusy(true);
    try {
      await authService.requestOtp(phone);
      setStage("code");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setBusy(true);
    try {
      const res = await authService.verifyOtp(phone, code, name);
      await setTokens(res.accessToken || res.token, res.refreshToken);
      onAuthed?.();
    } catch (e) {
      Alert.alert("Verification failed", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <AppText variant="h1">Partner login</AppText>
          <AppText variant="body" color="secondary" style={{ marginTop: spacing.sm }}>
            Enter your phone number to receive an OTP
          </AppText>

          <View style={styles.form}>
            <AppText variant="label">Phone number</AppText>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              editable={stage === "phone"}
              keyboardType="phone-pad"
              style={styles.input}
              placeholderTextColor={colors.textMuted}
            />

            {stage === "code" && (
              <>
                <AppText variant="label" style={{ marginTop: spacing.lg }}>
                  OTP
                </AppText>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={styles.input}
                  placeholder="6-digit code"
                  placeholderTextColor={colors.textMuted}
                />
                <AppText variant="label" style={{ marginTop: spacing.md }}>
                  Name (first time)
                </AppText>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholder="Optional"
                  placeholderTextColor={colors.textMuted}
                />
              </>
            )}

            <PrimaryButton
              title={stage === "phone" ? "Send OTP" : "Verify & continue"}
              onPress={stage === "phone" ? sendOtp : verify}
              loading={busy}
              style={{ marginTop: spacing.xl }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, justifyContent: "center" },
  form: { marginTop: spacing.xxl },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.xs,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.bg,
  },
});
