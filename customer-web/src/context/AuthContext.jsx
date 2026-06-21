import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setToken as persistToken, getToken } from "../services/apiClient";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { principal, needsProfile } = await authService.me();
      if (needsProfile) {
        persistToken(null);
        setUser(null);
      } else {
        setUser(principal);
      }
    } catch {
      persistToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback((token, principal) => {
    persistToken(token);
    setUser(principal);
  }, []);

  const updateUser = useCallback((principal) => {
    setUser(principal);
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
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
    [user, loading, login, logout, bootstrap]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
