import { createBrowserRouter, Navigate } from "react-router-dom";
import { authStorage } from "../shared/api/authStorage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { TalentListPage } from "../features/talent/pages/Talentlistpage";
import { AddTalentPage }  from "../features/talent/pages/Addtalentpage";
import { EditTalentPage } from "../features/talent/pages/Edittalentpage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = authStorage.get();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────────
  {
    path: "/login",
    element: <LoginPage />,
  },

  // ── Talent ──────────────────────────────────────────────────────────────────
  {
    path: "/talent",
    element: (
      <PrivateRoute>
        <TalentListPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/talent/add",
    element: (
      <PrivateRoute>
        <AddTalentPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/talent/edit/:id",
    element: (
      <PrivateRoute>
        <EditTalentPage />
      </PrivateRoute>
    ),
  },

  // ── Fallback ─────────────────────────────────────────────────────────────
  {
    path: "*",
    element: <Navigate to="/talent" replace />,
  },
]);
