import React, { useState } from "react";
import {
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { Text, Button, TextField, Card } from "../ui";
import { api, setTokens } from "../api";
import { palette, spacing, radii, shadows } from "../theme/tokens";

const HERO_URI =
  "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1200&q=80";

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [registrationToken, setRegistrationToken] = useState(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  async function finishLogin(res) {
    const access = res.accessToken || res.token;
    if (!access || !res.refreshToken) {
      throw new Error("invalid_auth_response");
    }
    await setTokens(access, res.refreshToken);
    navigation.replace("Home");
  }

  async function sendOtp() {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) return Alert.alert("Enter a valid phone");
    setLoading(true);
    try {
      await api.requestOtp(phone.trim());
      setStep("otp");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    if (String(code).trim().length !== 6) return Alert.alert("Enter 6-digit code");
    setLoading(true);
    try {
      const res = await api.verifyOtp(phone.trim(), String(code).trim());
      // New / incomplete profiles only get a registration token — must complete profile first.
      if (res.needsProfile) {
        if (!res.registrationToken) throw new Error("missing_registration_token");
        setRegistrationToken(res.registrationToken);
        setStep("profile");
        return;
      }
      await finishLogin(res);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitProfile() {
    if (!name.trim()) return Alert.alert("Enter your name");
    if (!gender) return Alert.alert("Select gender");
    if (!dateOfBirth.trim()) return Alert.alert("Enter date of birth (YYYY-MM-DD)");
    if (!registrationToken) return Alert.alert("Session expired", "Please verify OTP again.");
    setLoading(true);
    try {
      const res = await api.completeProfile(registrationToken, {
        name: name.trim(),
        gender,
        dateOfBirth: dateOfBirth.trim(),
      });
      await finishLogin(res);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <ImageBackground source={{ uri: HERO_URI }} style={{ height: "48%", width: "100%" }}>
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
            {step === "phone" && (
              <>
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
                  prefix="+91"
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
            )}

            {step === "otp" && (
              <>
                <Text variant="h2">Verify your number</Text>
                <Text variant="bodySm" color="secondary" style={{ marginTop: 4 }}>
                  Sent to +91 {phone}. Dev OTP: 000000
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
                  title="Continue"
                  onPress={verify}
                  loading={loading}
                  fullWidth
                  rightIcon={<Feather name="check" size={16} color={palette.textOnBrand} />}
                />
                <Pressable
                  onPress={() => {
                    setStep("phone");
                    setCode("");
                  }}
                  hitSlop={8}
                >
                  <Text
                    variant="bodySm"
                    color="muted"
                    style={{ textAlign: "center", marginTop: spacing.md }}
                  >
                    Use a different number
                  </Text>
                </Pressable>
              </>
            )}

            {step === "profile" && (
              <>
                <Text variant="h2">Quick setup</Text>
                <Text variant="bodySm" color="secondary" style={{ marginTop: 4 }}>
                  Just the basics — address comes when you book.
                </Text>
                <View style={{ height: spacing.lg }} />
                <TextField
                  label="Full name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  autoCapitalize="words"
                />
                <View style={{ height: spacing.md }} />
                <Text variant="caption" color="secondary" style={{ marginBottom: 6 }}>
                  Gender
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {GENDERS.map((g) => {
                    const selected = gender === g.value;
                    return (
                      <Pressable
                        key={g.value}
                        onPress={() => setGender(g.value)}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          borderRadius: radii.lg,
                          borderWidth: 1,
                          borderColor: selected ? palette.brand : palette.hairline,
                          backgroundColor: selected ? `${palette.brand}14` : palette.surface,
                        }}
                      >
                        <Text
                          variant="bodySmMd"
                          style={{ color: selected ? palette.brand : palette.textSecondary }}
                        >
                          {g.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View style={{ height: spacing.md }} />
                <TextField
                  label="Date of birth"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="YYYY-MM-DD"
                  keyboardType="numbers-and-punctuation"
                  hint="Example: 1995-06-15"
                />
                <View style={{ height: spacing.lg }} />
                <Button
                  title="Save & continue"
                  onPress={submitProfile}
                  loading={loading}
                  fullWidth
                  rightIcon={<Feather name="arrow-right" size={16} color={palette.textOnBrand} />}
                />
              </>
            )}

            <View style={{ height: spacing.lg }} />
            <Text variant="bodySm" color="muted" style={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Text variant="bodySmMd" style={{ color: palette.brand }}>
                Register Now
              </Text>
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
      <Text variant="bodySmMd" style={{ marginLeft: spacing.sm }}>
        {label}
      </Text>
    </Pressable>
  );
}
