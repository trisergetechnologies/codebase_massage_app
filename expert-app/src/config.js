// DEV ONLY — ngrok tunnel to local backend (Metro reload picks this up; no APK rebuild).
// Update when ngrok URL changes. Remove before next EAS build / use app.json extra.apiBase.
// export const API_BASE = "https://cake-dropper-courier.ngrok-free.dev";
export const API_BASE = "http://192.168.1.35:4000";

// --- restore for production build ---
// import Constants from "expo-constants";
// import { Platform } from "react-native";
// function defaultBase() {
//   if (Platform.OS === "android") return "http://10.0.2.2:4000";
//   return "http://localhost:4000";
// }
// export const API_BASE = Constants.expoConfig?.extra?.apiBase || defaultBase();
