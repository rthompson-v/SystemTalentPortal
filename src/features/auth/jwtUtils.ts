import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "./jwt";

export function decodeUserFromToken(token: string) {
  const p = jwtDecode<JwtPayload>(token);
  return { USER_CLP: p.USER_CLP, Role_CLP: p.Role_CLP, RoleName: p.RoleName };
}

export function isExpired(token: string) {
  const p = jwtDecode<JwtPayload>(token);
  return Date.now() >= p.exp * 1000;
}