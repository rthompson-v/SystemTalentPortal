// features/auth/auth.service.ts
import { supabase } from "../../../SupabaseClient";
import type { LoginRequest, LoginResponse } from "./types";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  // 1) Buscar auth_id del usuario por USER_CLP
  const { data: userRow, error: lookupErr } = await supabase
    .from("Usuario")
    .select("auth_id")
    .eq("USER_CLP", payload.USER_CLP)
    .single();

  if (lookupErr || !userRow?.auth_id) {
    throw new Error("Credenciales inválidas");
  }

  // 2) Obtener el email real desde auth.users via RPC
  const { data: emailData, error: emailErr } = await supabase
    .rpc("get_user_email_by_auth_id", { p_auth_id: userRow.auth_id });

  if (emailErr || !emailData) {
    throw new Error("Credenciales inválidas");
  }

  // 3) Sign in con Supabase Auth usando el email real
  const { data, error } = await supabase.auth.signInWithPassword({
    email:    emailData as string,
    password: payload.PASS_CLP,
  });

  if (error || !data.session) {
    throw new Error("Credenciales inválidas");
  }

  // 4) Obtener rol
  const { data: roleData } = await supabase.rpc("get_user_role", {
    p_user_clp: payload.USER_CLP,
  });

  const user = roleData?.data ?? {};

  return {
    ok:    true,
    token: data.session.access_token,
    user: {
      USER_CLP: user.USER_CLP ?? payload.USER_CLP,
      Role_CLP: user.Role_CLP ?? null,
      RoleName: user.RoleName ?? null,
    },
  };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}
