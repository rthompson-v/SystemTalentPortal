import { createBrowserRouter, Navigate } from "react-router-dom";
import { authStorage } from "../shared/api/authStorage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { TalentPage } from "../features/talent/pages/TalentPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = authStorage.get();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/talent",
    element: (
      <PrivateRoute>
        <TalentPage />
      </PrivateRoute>
    ),
  },
  { path: "*", element: <Navigate to="/talent" replace /> },
]);