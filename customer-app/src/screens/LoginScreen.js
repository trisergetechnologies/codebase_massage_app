import React, { useState } from "react";
import {
  View, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { Text, Button, TextField, Card } from "../ui";
import { api, setToken } from "../api";
import { palette, spacing, radii, shadows } from "../theme/tokens";

const HERO_URI =
  "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1200&q=80";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    if (phone.length < 10) return Alert.alert("Enter a valid phone");
    setLoading(true);
    try { await api.requestOtp(phone, "customer"); setStep("otp"); }
    catch (e) { Alert.alert("Error", e.message); }
    finally { setLoading(false); }
  }

  async function verify() {
    if (code.length !== 6) return Alert.alert("Enter 6-digit code");
    setLoading(true);
    try {
      const { token } = await api.verifyOtp(phone, code, "customer");
      await setToken(token);
      navigation.replace("Home");
    } catch (e) { Alert.alert("Error", e.message); }
    finally { setLoading(false); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      {/* Photo hero — top half of screen */}
      <ImageBackground
        source={{ uri: HERO_URI }}
        style={{ height: "48%", width: "100%" }}
      >
        <LinearGradient
          colors={["rgba(40, 22, 12, 0.0)", "rgba(40, 22, 12, 0.65)", "rgba(40, 22, 12, 0.85)"]}
          locations={[0, 0.55, 1]}
          style={{ flex: 1, padding: spacing.xl, justifyContent: "flex-end" }}
        >
          <Text variant="display" style={{ color: "#FFFFFF" }}>
            Let's get you in!
          </Text>
          <Text variant="body" style={{ color: "#FFFFFF", opacity: 0.9, marginTop: spacing.sm }}>
            Enter your phone to continue.
          </Text>
        </LinearGradient>
      </ImageBackground>

      {/* White card overlapping the hero from below */}
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop: -spacing.xxxl }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card
            radius={radii.xxxl}
            elevation="lg"
            padding={spacing.xl}
            style={{ marginHorizontal: spacing.lg, marginBottom: spacing.lg }}
          >
            {step === "phone" ? (
              <>
                {/* Social row — visual only for now (kept for visual parity with reference) */}
                <View style={{ flexDirection: "row", gap: spacing.md }}>
                  <SocialButton icon="facebook" label="Facebook" color="#1877F2" />
                  <SocialButton icon="chrome" label="Google" color="#DB4437" />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: spacing.lg }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: palette.hairline }} />
                  <Text variant="bodySm" color="muted" style={{ marginHorizontal: spacing.md }}>
                    Or login with
                  </Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: palette.hairline }} />
                </View>

                <TextField
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Mobile number"
                  keyboardType="phone-pad"
                  leftIcon={<Feather name="phone" size={16} color={palette.textSecondary} />}
                />
                <View style={{ height: spacing.lg }} />
                <Button
                  title="Continue"
                  onPress={sendOtp}
                  loading={loading}
                  fullWidth
                  rightIcon={<Feather name="arrow-right" size={16} color={palette.textOnBrand} />}
                />
              </>
            ) : (
              <>
                <Text variant="h2">Verify your number</Text>
                <Text variant="bodySm" color="secondary" style={{ marginTop: 4 }}>
                  Sent to +91 {phone}. Use any 6 digits in dev.
                </Text>
                <View style={{ height: spacing.lg }} />
                <TextField
                  value={code}
                  onChangeText={setCode}
                  placeholder="6-digit code"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <View style={{ height: spacing.lg }} />
                <Button
                  title="Login"
                  onPress={verify}
                  loading={loading}
                  fullWidth
                  rightIcon={<Feather name="check" size={16} color={palette.textOnBrand} />}
                />
                <View style={{ height: spacing.sm }} />
                <Pressable onPress={() => { setStep("phone"); setCode(""); }} hitSlop={8}>
                  <Text variant="bodySm" color="muted" style={{ textAlign: "center", marginTop: spacing.md }}>
                    Use a different number
                  </Text>
                </Pressable>
              </>
            )}

            <View style={{ height: spacing.lg }} />
            <Text variant="bodySm" color="muted" style={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Text variant="bodySmMd" style={{ color: palette.brand }}>Register Now</Text>
            </Text>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function SocialButton({ icon, label, color }) {
  return (
    <Pressable
      onPress={() => {}}
      style={({ pressed }) => [
        {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 12,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: palette.hairline,
          backgroundColor: palette.surface,
          opacity: pressed ? 0.85 : 1,
        },
        shadows.sm,
      ]}
    >
      <Feather name={icon} size={16} color={color} />
      <Text variant="bodySmMd" style={{ marginLeft: spacing.sm }}>{label}</Text>
    </Pressable>
  );
}
