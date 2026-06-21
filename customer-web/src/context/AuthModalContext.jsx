import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({});

  const openLogin = useCallback((opts = {}) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setOpen(false);
    setOptions({});
  }, []);

  const value = useMemo(
    () => ({ open, options, openLogin, closeLogin }),
    [open, options, openLogin, closeLogin]
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal requires AuthModalProvider");
  return ctx;
}
