import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export function PrivateRoute({
  children,
  allowRoleNames,
  allowRoleIds,
}: {
  children: React.ReactNode;
  allowRoleNames?: string[];
  allowRoleIds?: number[];
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowRoleIds?.length && user) {
    if (!allowRoleIds.includes(user.Role_CLP)) return <Navigate to="/forbidden" replace />;
  }

  if (allowRoleNames?.length && user) {
    const name = user.RoleName ?? "";
    if (!allowRoleNames.includes(name)) return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}