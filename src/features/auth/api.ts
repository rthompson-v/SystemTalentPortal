import { http } from "../../shared/api/http";
import type { LoginRequest, LoginResponse } from "./types";

export async function loginApi(payload: LoginRequest) {
  const { data } = await http.post<LoginResponse>("/auth/login", payload);
  if (!data.ok) throw new Error(data.error ?? "Login failed");
  return data;
}