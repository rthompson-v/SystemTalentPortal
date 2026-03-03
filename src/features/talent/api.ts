import { http } from "../../shared/api/http";
import type { Talent, CreateTalent } from "./types";

export async function listTalentApi() {
  const { data } = await http.get<Talent[]>("/talent");
  return data;
}

export async function createTalentApi(payload: CreateTalent) {
  const { data } = await http.post<Talent>("/talent", payload);
  return data;
}