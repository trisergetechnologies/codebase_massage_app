import React, { useState } from "react";
import { View, TextInput, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpertSession } from "../context/ExpertSessionContext";
import { expertService } from "../services/expertService";
import { colors, spacing, radii } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { PrimaryButton } from "../components/ui/PrimaryButton";

export default function ProfileEditScreen({ navigation }) {
  const { me, refreshMe } = useExpertSession();
  const [name, setName] = useState(me?.name || "");
  const [email, setEmail] = useState(me?.email || "");
  const [bio, setBio] = useState(me?.bio || "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await expertService.updateProfile({ name: name.trim(), email: email.trim(), bio: bio.trim() });
      await refreshMe();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Could not save", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="caption" color="secondary">Display name</AppText>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor={colors.textMuted}
        />
        <AppText variant="caption" color="secondary" style={{ marginTop: spacing.lg }}>Email</AppText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor={colors.textMuted}
        />
        <AppText variant="caption" color="secondary" style={{ marginTop: spacing.lg }}>Bio</AppText>
        <TextInput
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          style={[styles.input, { minHeight: 88 }]}
          placeholderTextColor={colors.textMuted}
        />
        <PrimaryButton title={busy ? "Saving…" : "Save profile"} onPress={save} disabled={busy} style={{ marginTop: spacing.xxl }} />
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
});
