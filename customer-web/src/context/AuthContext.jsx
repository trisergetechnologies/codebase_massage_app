import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  setTokens,
  getAccessToken,
  logoutRemote,
  onAuthFailure,
} from "../services/apiClient";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { principal, needsProfile } = await authService.me();
      if (needsProfile) {
        await logoutRemote();
        setUser(null);
      } else {
        setUser(principal);
      }
    } catch {
      await logoutRemote();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    return onAuthFailure(() => {
      setUser(null);
    });
  }, []);

  const login = useCallback((accessToken, principal, refreshToken) => {
    setTokens(accessToken, refreshToken || null);
    setUser(principal);
  }, []);

  const updateUser = useCallback((principal) => {
    setUser(principal);
  }, []);

  const logout = useCallback(async () => {
    await logoutRemote();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser,
      refresh: bootstrap,
    }),
    [user, loading, login, logout, updateUser, bootstrap]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
