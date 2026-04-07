// src/app/PrivateRoute.tsx
// Reemplaza tu PrivateRoute actual — el único cambio es el null-check en Role_CLP

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

interface Props {
  allowedRoles?: number[]; // si no se pasa, solo requiere estar autenticado
}

export function PrivateRoute({ allowedRoles }: Props) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role_CLP puede ser null — lo tratamos como 0 para la comparación
  if (allowedRoles && allowedRoles.length > 0) {
    const roleId: number = user?.Role_CLP ?? 0;
    if (!allowedRoles.includes(roleId)) {
      return <Navigate to="/talent" replace />;
    }
  }

  return <Outlet />;
}