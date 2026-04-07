// features/auth/api.ts
import { supabase } from "../../Supabaseclient";
import type { LoginRequest, LoginResponse } from "./types";

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  // 1) Supabase Auth — necesita email. Si el USER_CLP no tiene @,
  //    lo buscamos en la tabla Usuario para obtener el email real.
  let email = payload.USER_CLP;

  if (!payload.USER_CLP.includes("@")) {
    const { data: userRow, error: lookupErr } = await supabase
      .from("Usuario")
      .select("email")
      .eq("USER_CLP", payload.USER_CLP)
      .single();

    if (lookupErr || !userRow?.email) {
      throw new Error("Credenciales inválidas");
    }
    email = userRow.email;
  }

  // 2) Sign in con Supabase Auth (maneja bcrypt internamente)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: payload.PASS_CLP,
  });

  if (error || !data.session) {
    throw new Error("Credenciales inválidas");
  }

  // 3) Obtener rol del usuario desde tu tabla personalizada
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

export async function logoutApi(): Promise<void> {
  await supabase.auth.signOut();
}