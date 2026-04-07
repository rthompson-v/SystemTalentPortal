// features/auth/useAuth.ts
// Si zustand no está instalado: npm install zustand
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "../../../SupabaseClient";

interface UserInfo {
  USER_CLP: string;
  Role_CLP: number | null;
  RoleName: string | null;
}

interface AuthState {
  token:           string | null;
  user:            UserInfo | null;
  isAuthenticated: boolean;
  setSession:      (token: string, user: UserInfo) => void;
  logout:          () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      token:           null,
      user:            null,
      isAuthenticated: false,

      setSession: (token: string, user: UserInfo) =>
        set({ token, user, isAuthenticated: true }),

      logout: async () => {
        await supabase.auth.signOut();
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name:    "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);