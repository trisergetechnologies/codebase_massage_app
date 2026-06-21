import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { setToken, getToken } from "../services/apiClient";
import { expertService } from "../services/expertService";
import {
  ensureLocationPermission,
  startLocationPolling,
  stopLocationPolling,
} from "../services/locationService";
import { getSocket, disconnectSocket, onDispatchOffer } from "../socket";

const ExpertSessionContext = createContext(null);

export function ExpertSessionProvider({ children, navigationRef, sessionKey = 0 }) {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState(null);
  const [secLeft, setSecLeft] = useState(0);
  const [goingOnline, setGoingOnline] = useState(false);
  const socketRef = useRef(null);
  const activeBookingRef = useRef(null);

  useEffect(() => {
    activeBookingRef.current = me?.activeBooking || null;
  }, [me?.activeBooking]);

  const handleOffer = useCallback((data) => {
    setOffer(data);
    setSecLeft(data.offerExpiresInSec || 30);
  }, []);

  useEffect(() => {
    onDispatchOffer(handleOffer);
    return () => onDispatchOffer(null);
  }, [handleOffer]);

  useEffect(() => {
    if (me?.status !== "online") return undefined;
    let cancelled = false;
    const poll = async () => {
      if (cancelled || offer) return;
      try {
        const pending = await expertService.pendingOffer();
        if (pending && !cancelled) handleOffer(pending);
      } catch {
        /* ignore poll errors */
      }
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [me?.status, offer, handleOffer]);

  const clearSession = useCallback(async () => {
    stopLocationPolling();
    disconnectSocket();
    socketRef.current = null;
    await setToken(null);
    setMe(null);
  }, []);

  const refreshMe = useCallback(async () => {
    try {
      const profile = await expertService.me();
      setMe(profile);
      return profile;
    } catch (e) {
      if (e.status === 404) {
        await clearSession();
        navigationRef?.current?.reset({ index: 0, routes: [{ name: "Login" }] });
      }
      throw e;
    }
  }, [clearSession, navigationRef]);

  async function connectRealtime() {
    disconnectSocket();
    const socket = await getSocket();
    socketRef.current = socket;
    return socket;
  }

  function emitLocation(coords) {
    const sock = socketRef.current;
    if (sock?.connected) {
      sock.emit("expert:location", {
        lat: coords.lat,
        lng: coords.lng,
        bookingId: activeBookingRef.current,
      });
    }
  }

  async function syncLocationToServer(coords) {
    await expertService.goOnline(coords.lat, coords.lng);
  }

  async function beginLocationTracking({ syncServer = true, intervalMs = 15000 } = {}) {
    const granted = await ensureLocationPermission();
    if (!granted) {
      Alert.alert("Location required", "We need your location to receive and fulfill jobs.");
      return null;
    }

    return startLocationPolling(async (coords) => {
      emitLocation(coords);
      if (syncServer) {
        try {
          await syncLocationToServer(coords);
        } catch {
          /* keep polling even if one sync fails */
        }
      }
    }, intervalMs);
  }

  async function syncOnlineLocation(profile) {
    if (profile?.status !== "online" && profile?.status !== "on_job") return profile;
    const onJob = profile?.status === "on_job";
    const initial = await beginLocationTracking({
      syncServer: true,
      intervalMs: onJob ? 10000 : 30000,
    });
    if (!initial) return profile;
    return refreshMe();
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        if (!token) {
          if (mounted) setLoading(false);
          return;
        }
        let profile = await refreshMe();
        if (!mounted) return;
        if (profile?.status === "online" || profile?.status === "on_job") {
          profile = await syncOnlineLocation(profile);
        }
        if (!mounted) return;
        await connectRealtime().catch(() => {});
      } catch (e) {
        if (e.status !== 404) {
          Alert.alert("Could not load profile", e.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      stopLocationPolling();
    };
  }, [refreshMe, sessionKey]);

  useEffect(() => {
    if (!offer) return undefined;
    if (secLeft <= 0) {
      setOffer(null);
      return undefined;
    }
    const t = setTimeout(() => setSecLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [offer, secLeft]);

  async function setOnline(value) {
    setGoingOnline(true);
    try {
      if (value) {
        const initial = await beginLocationTracking({ syncServer: true, intervalMs: 30000 });
        if (!initial) return;
        const updated = await expertService.goOnline(initial.lat, initial.lng);
        setMe(updated);
        await connectRealtime().catch(() => {});
      } else {
        stopLocationPolling();
        const updated = await expertService.goOffline();
        setMe(updated);
      }
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setGoingOnline(false);
    }
  }

  function respondToOffer(accepted) {
    if (!offer) return;
    const bookingId = offer.bookingId;
    setOffer(null);
    const send = expertService.respondOffer(bookingId, accepted);
    if (socketRef.current?.connected) {
      socketRef.current.emit("dispatch:respond", { bookingId, accepted });
    }
    send.catch((e) => Alert.alert("Error", e.message));
    if (accepted) {
      navigationRef?.current?.navigate("ActiveOrder", { bookingId });
      refreshMe();
    }
  }

  async function logout() {
    await clearSession();
    navigationRef?.current?.reset({ index: 0, routes: [{ name: "Login" }] });
  }

  const value = {
    me,
    loading,
    offer,
    secLeft,
    goingOnline,
    refreshMe,
    setOnline,
    respondToOffer,
    logout,
    socketRef,
  };

  return (
    <ExpertSessionContext.Provider value={value}>
      {children}
    </ExpertSessionContext.Provider>
  );
}

export function useExpertSession() {
  const ctx = useContext(ExpertSessionContext);
  if (!ctx) throw new Error("useExpertSession must be used within ExpertSessionProvider");
  return ctx;
}
