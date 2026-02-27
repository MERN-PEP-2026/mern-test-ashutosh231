import { createContext, useContext, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "tm_token";

const AuthContext = createContext(null);

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readToken());

  useEffect(() => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore storage failures
    }
  }, [token]);

  const value = useMemo(() => {
    const isAuthenticated = Boolean(token);
    return {
      token,
      isAuthenticated,
      login: (newToken) => setToken(newToken || ""),
      logout: () => setToken("")
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

