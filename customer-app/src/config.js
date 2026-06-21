import Constants from "expo-constants";
import { Platform } from "react-native";

// On Android emulators 10.0.2.2 is the host loopback. iOS sim & web can use localhost.
function defaultBase() {
  if (Platform.OS === "android") return "http://10.0.2.2:4000";
  return "http://localhost:4000";
}

export const API_BASE =
  Constants.expoConfig?.extra?.apiBase || defaultBase();
