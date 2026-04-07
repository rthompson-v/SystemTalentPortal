import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { LoginPage }      from "../features/auth/pages/LoginPage";
import { TalentListPage } from "../features/talent/pages/Talentlistpage";
import { AddTalentPage }  from "../features/talent/pages/Addtalentpage";
import { EditTalentPage } from "../features/talent/pages/Edittalentpage";

// ── PrivateRoute usando Zustand (useAuth) en lugar de authStorage ─────────────
function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────────
  {
    path: "/login",
    element: <LoginPage />,
  },

  // ── Rutas protegidas ─────────────────────────────────────────────────────────
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/talent",
        element: <TalentListPage />,
      },
      {
        path: "/talent/add",
        element: <AddTalentPage />,
      },
      {
        path: "/talent/edit/:id",
        element: <EditTalentPage />,
      },
    ],
  },

  // ── Fallback ──────────────────────────────────────────────────────────────
  {
    path: "*",
    element: <Navigate to="/talent" replace />,
  },
]);