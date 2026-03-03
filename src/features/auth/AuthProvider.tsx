import React, { createContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authStorage } from "../../shared/api/authStorage";

export type BackendUser = {
  USER_CLP: string;
  Role_CLP: number;
  RoleName: string | null;
};

// El payload real que tú firmas en backend + exp
type JwtPayload = BackendUser & {
  exp: number; // en segundos
};

type AuthState = {
  token: string | null;
  user: BackendUser | null;
  isAuthenticated: boolean;
  setSession: (token: string, user?: BackendUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthState | null>(null);

function safeDecodeUser(token: string): { user: BackendUser | null; expMs: number | null } {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    const user: BackendUser = {
      USER_CLP: payload.USER_CLP,
      Role_CLP: payload.Role_CLP,
      RoleName: payload.RoleName ?? null,
    };
    const expMs = payload.exp ? payload.exp * 1000 : null;
    return { user, expMs };
  } catch {
    return { user: null, expMs: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => authStorage.get());

  // user derivado del token (persistente con refresh)
  const decoded = useMemo(() => {
    if (!token) return { user: null as BackendUser | null, expMs: null as number | null };
    return safeDecodeUser(token);
  }, [token]);

  const user = decoded.user;
  const isAuthenticated = !!token && !!user;

  function logout() {
    authStorage.clear();
    setToken(null);
  }

  /**
   * setSession: lo llamas al hacer login.
   * - Guarda token
   * - Opcionalmente ignoras el "user" del backend porque lo podemos derivar del JWT
   *   (pero lo acepto por compatibilidad)
   */
  function setSession(nextToken: string) {
    authStorage.set(nextToken);
    setToken(nextToken);
  }

  // Auto-logout si expiró
  useEffect(() => {
    if (!token) return;

    const { expMs } = decoded;
    if (!expMs) {
      // Si no hay exp o el token es raro, mejor sacar sesión
      logout();
      return;
    }

    const now = Date.now();
    if (now >= expMs) {
      logout();
      return;
    }

    const timeoutMs = expMs - now;
    const id = window.setTimeout(() => logout(), timeoutMs);

    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, decoded.expMs]);

  const value: AuthState = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      setSession,
      logout,
    }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}