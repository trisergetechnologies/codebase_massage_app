import "react-native-gesture-handler"; // must be the very first import (RNGH requirement)
import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, Text as RNText } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";

import { CartProvider } from "./src/CartContext";
import { getToken } from "./src/api";
import { palette, navTheme, fonts } from "./src/theme/tokens";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ServiceDetailScreen from "./src/screens/ServiceDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import BookingScreen from "./src/screens/BookingScreen";
import HistoryScreen from "./src/screens/HistoryScreen";

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  ...navTheme,
  colors: { ...DefaultTheme.colors, ...navTheme.colors },
};

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const [fontsReady] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setAuthed(!!t);
      setAuthReady(true);
    })();
  }, []);

  if (!authReady || !fontsReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: palette.bg }}>
        <ActivityIndicator color={palette.ink} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CartProvider>
          <NavigationContainer theme={theme}>
            <StatusBar style="dark" />
            <Stack.Navigator
              initialRouteName={authed ? "Home" : "Login"}
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: palette.bg },
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Booking" component={BookingScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
