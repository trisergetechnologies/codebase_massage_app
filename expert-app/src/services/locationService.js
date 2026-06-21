import { AppState } from "react-native";
import * as Location from "expo-location";

let pollTimer = null;

export async function ensureLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

export async function readCurrentCoords() {
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { lat: pos.coords.latitude, lng: pos.coords.longitude };
}

export function stopLocationPolling() {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

/**
 * Poll GPS on an interval (avoids watchPositionAsync NPE crashes on Android).
 * Returns the initial fix, or null if permission/location unavailable.
 */
export async function startLocationPolling(onTick, intervalMs = 15000) {
  stopLocationPolling();

  const tick = async () => {
    if (AppState.currentState !== "active") return;
    try {
      const coords = await readCurrentCoords();
      onTick(coords);
    } catch {
      /* device may briefly lose fix */
    }
  };

  let initial;
  try {
    initial = await readCurrentCoords();
  } catch {
    return null;
  }

  onTick(initial);
  pollTimer = setInterval(tick, intervalMs);
  return initial;
}
