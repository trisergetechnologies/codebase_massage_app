// DEV ONLY — laptop LAN IP so physical phones on the same Wi‑Fi can reach the backend.
// Update when your PC IP changes (run: ipconfig). Remove before EAS / production builds.
// export const API_BASE = "https://YOUR-NGROK.ngrok-free.dev";
export const API_BASE = "http://192.168.1.37:4000";

// --- restore for emulator / production build ---
// import Constants from "expo-constants";
// import { Platform } from "react-native";
// function defaultBase() {
//   if (Platform.OS === "android") return "http://10.0.2.2:4000";
//   return "http://localhost:4000";
// }
// export const API_BASE =
//   Constants.expoConfig?.extra?.apiBase || defaultBase();
