import "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

import { getToken } from "./src/services/apiClient";
import { colors } from "./src/theme/tokens";
import { ExpertSessionProvider } from "./src/context/ExpertSessionContext";
import { IncomingOrderModal } from "./src/components/orders/IncomingOrderModal";

import LoginScreen from "./src/screens/LoginScreen";
import MainTabs from "./src/navigation/MainTabs";
import ActiveOrderScreen from "./src/screens/ActiveOrderScreen";
import ProfileEditScreen from "./src/screens/ProfileEditScreen";
import TrainingScreen from "./src/screens/TrainingScreen";
import KycScreen from "./src/screens/KycScreen";
import SupportScreen from "./src/screens/SupportScreen";

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const navRef = useRef(null);

  function onLoginSuccess(navigation) {
    setAuthed(true);
    setSessionKey((k) => k + 1);
    navigation.replace("MainTabs");
  }

  const [fontsReady] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setAuthed(!!t);
      setReady(true);
    })();
  }, []);

  if (!ready || !fontsReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navRef} theme={navTheme}>
          <ExpertSessionProvider key={sessionKey} navigationRef={navRef} sessionKey={sessionKey}>
            <StatusBar style="dark" />
            <Stack.Navigator
              initialRouteName={authed ? "MainTabs" : "Login"}
              screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                contentStyle: { backgroundColor: colors.bg },
                headerShadowVisible: false,
              }}
            >
              <Stack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => (
                  <LoginScreen {...props} onAuthed={() => onLoginSuccess(props.navigation)} />
                )}
              </Stack.Screen>
              <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen
                name="ActiveOrder"
                component={ActiveOrderScreen}
                options={{ title: "Active order", presentation: "card" }}
              />
              <Stack.Screen
                name="ProfileEdit"
                component={ProfileEditScreen}
                options={{ title: "Edit profile" }}
              />
              <Stack.Screen name="Training" component={TrainingScreen} options={{ title: "Training" }} />
              <Stack.Screen name="Kyc" component={KycScreen} options={{ title: "KYC" }} />
              <Stack.Screen name="Support" component={SupportScreen} options={{ title: "Support" }} />
            </Stack.Navigator>
            <IncomingOrderModal />
          </ExpertSessionProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
