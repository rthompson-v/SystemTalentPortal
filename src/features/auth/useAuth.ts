import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

/**
 * Hook para acceder a la sesión desde cualquier componente.
 * Debe usarse dentro de <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}