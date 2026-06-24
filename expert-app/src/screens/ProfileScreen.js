import React, { useCallback } from "react";
import { View, Image, ScrollView, Pressable, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useExpertSession } from "../context/ExpertSessionContext";
import { colors, spacing, radii } from "../theme/tokens";
import { AppText } from "../components/ui/AppText";
import { LoadingView } from "../components/feedback/LoadingView";

const TRAINING_LABELS = {
  pending: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

const KYC_LABELS = {
  pending: "Not submitted",
  submitted: "Under review",
  verified: "Verified",
  rejected: "Needs update",
};

export default function ProfileScreen({ navigation }) {
  const { me, loading, refreshMe, logout } = useExpertSession();

  useFocusEffect(
    useCallback(() => {
      refreshMe().catch(() => {});
    }, [refreshMe])
  );

  if (loading || !me) return <LoadingView />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="h1">Profile</AppText>

        <View style={styles.hero}>
          {me.photoUrl ? (
            <Image source={{ uri: me.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Feather name="user" size={32} color={colors.textSecondary} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <AppText variant="h2">{me.name}</AppText>
            <AppText variant="body" color="secondary">
              {me.phone}
            </AppText>
            <AppText variant="caption" color="secondary" style={{ marginTop: spacing.xs }}>
              ★ {(me.rating || 0).toFixed(1)} · {me.completedJobs || 0} jobs
            </AppText>
          </View>
        </View>

        <MenuRow
          icon="edit-2"
          label="Edit profile"
          onPress={() => navigation.getParent()?.navigate("ProfileEdit")}
        />
        <MenuRow
          icon="book-open"
          label="Training"
          value={TRAINING_LABELS[me.trainingStatus] || me.trainingStatus}
          onPress={() => navigation.getParent()?.navigate("Training")}
        />
        <MenuRow
          icon="shield"
          label="KYC & profile"
          value={KYC_LABELS[me.kycStatus] || me.kycStatus}
          onPress={() => navigation.getParent()?.navigate("Kyc")}
        />
        <MenuRow
          icon="headphones"
          label="Support"
          onPress={() => navigation.getParent()?.navigate("Support")}
        />
        <MenuRow icon="log-out" label="Logout" onPress={logout} danger />
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({ icon, label, value, onPress, danger }) {
  return (
    <Pressable onPress={onPress} style={styles.menuRow}>
      <Feather name={icon} size={22} color={danger ? colors.danger : colors.text} />
      <View style={{ flex: 1, marginLeft: spacing.lg }}>
        <AppText variant="body" style={danger ? { color: colors.danger } : null}>
          {label}
        </AppText>
        {value ? (
          <AppText variant="caption" color="secondary">
            {value}
          </AppText>
        ) : null}
      </View>
      <Feather name="chevron-right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxl * 2 },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
