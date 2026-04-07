// features/talent/api.ts
// Reemplaza todas las llamadas a http (Axios → Express) por Supabase directo.
// Catálogos: supabase.from()   → API REST auto-generada (lectura directa)
// Operaciones complejas: supabase.rpc() → procedimientos almacenados

import { supabase } from "../../Supabaseclient";
import { useAuth } from "../auth/useAuth";
import type {
  Talent, CreateTalent, UpdateTalent, CatalogItem,
  PaginatedResponse, SearchPayload, SearchResponse,
} from "./types";

// ── Helper: obtener role_id del usuario en sesión ─────────────────────────────
function getRoleId(): number {
  const user = useAuth.getState().user;
  return user?.Role_CLP ?? 0;
}

// ── Helper: lanzar error si la RPC falla ──────────────────────────────────────
function assertRpc(data: any, error: any, label: string) {
  if (error) throw new Error(`${label}: ${error.message}`);
  if (data?.ok === false) throw new Error(`${label}: ${data.error ?? "Error desconocido"}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// LISTA PAGINADA — reemplaza POST /candidates/profile-view-by-role
// ─────────────────────────────────────────────────────────────────────────────
export async function listTalentApi(page = 1, limit = 20): Promise<PaginatedResponse> {
  const { data, error } = await supabase.rpc("profile_view_by_role", {
    p_role_id: getRoleId(),
    p_limit:   limit,
    p_page:    page,
  });
  assertRpc(data, error, "listTalentApi");
  return data as PaginatedResponse;
}

// ─────────────────────────────────────────────────────────────────────────────
// BÚSQUEDA — reemplaza POST /candidates/search
// ─────────────────────────────────────────────────────────────────────────────
export async function searchTalentApi(payload: SearchPayload): Promise<SearchResponse> {
  const { data, error } = await supabase.rpc("search_candidates", {
    p_q:       payload.q     ?? "",
    p_limit:   payload.limit ?? 50,
    p_role_id: getRoleId(),
  });
  assertRpc(data, error, "searchTalentApi");
  return data as SearchResponse;
}

// ─────────────────────────────────────────────────────────────────────────────
// DETALLE — reemplaza GET /candidates/:candidate_code
// ─────────────────────────────────────────────────────────────────────────────
export async function getTalentApi(candidate_code: string): Promise<Talent> {
  const { data, error } = await supabase.rpc("get_candidate_by_code", {
    p_candidate_code: candidate_code,
  });
  assertRpc(data, error, "getTalentApi");
  // La RPC devuelve { ok, data: { candidate, stack, lastCompensation, ... } }
  return data.data as Talent;
}

// ─────────────────────────────────────────────────────────────────────────────
// CREAR — reemplaza POST /candidates
// ─────────────────────────────────────────────────────────────────────────────
export async function createTalentApi(payload: CreateTalent): Promise<{ candidate_id: number; candidate_code: string }> {
  // Modulos viene como array de objetos { technology, module?, submodule? }
  // add_candidate_full ya los maneja como JSONB
  const { data, error } = await supabase.rpc("add_candidate_full", {
    p_data: {
      Name:             payload.Name,
      Telefono:         payload.Telefono       ?? null,
      Email:            payload.Email          ?? null,
      CV:               payload.CV             ?? null,
      Rol:              payload.Rol,
      Location:         payload.Location       ?? null,
      EnglishLevel:     payload.EnglishLevel   ?? null,
      Experiencia:      payload.Experiencia    ?? null,
      Expectativas:     payload.Expectativas   ?? null,
      Skillset:         payload.Skillset       ?? null,
      Visa:             payload.Visa           ?? null,
      HiringPreference: payload.HiringPreference ?? null,
      // Modulos: array de { technology, module?, submodule? }
      Modulos: Array.isArray(payload.Modulos) ? payload.Modulos : [],
    },
  });
  assertRpc(data, error, "createTalentApi");
  return data as { candidate_id: number; candidate_code: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTUALIZAR — reemplaza PUT /candidates/update/:candidate_code
// ─────────────────────────────────────────────────────────────────────────────
export async function updateTalentApi(
  candidate_code: string,
  payload: UpdateTalent
): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await supabase.rpc("update_candidate_by_code", {
    p_candidate_code: candidate_code,
    p_name:           payload.Name         ?? null,
    p_telefono:       payload.Telefono     ?? null,
    p_email:          payload.Email        ?? null,
    p_cv:             payload.CV           ?? null,
    p_location:       payload.Location     ?? null,
    p_rol:            payload.Rol          ?? null,
    p_english_level:  payload.EnglishLevel ?? null,
    p_experiencia:    payload.Experiencia  ?? null,
    p_expectativas:   payload.Expectativas ?? null,
    p_skillset:       payload.Skillset     ?? null,
    p_visa:           payload.Visa         ?? null,
    p_hiring_pref:    payload.HiringPreference ?? null,
    p_technologies:   Array.isArray(payload.Tecnologia)
                        ? payload.Tecnologia
                        : payload.Tecnologia ? [payload.Tecnologia] : null,
    p_replace_stack:  payload.replaceStack ?? false,
  });
  assertRpc(data, error, "updateTalentApi");
  return data as { ok: boolean; message: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGOS — lectura directa sin RPC (tablas con RLS de solo lectura)
// Reemplazan: GET /candidates/catalogs/*
// ─────────────────────────────────────────────────────────────────────────────
export async function getRolesApi(): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_role")
    .select("role_id, name")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ id: r.role_id, name: r.name }));
}

export async function getLocationsApi(): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_location")
    .select("location_id, name")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ id: r.location_id, name: r.name }));
}

export async function getTechnologiesApi(): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_technology")
    .select("technology_id, ct_name_tech")
    .order("ct_name_tech");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ id: r.technology_id, name: r.ct_name_tech }));
}

export async function getHiringPreferencesApi(): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_hiring_preference")
    .select("hiring_preference_id, name")
    .order("hiring_preference_id");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ id: r.hiring_preference_id, name: r.name }));
}

export async function getModulesApi(technology_id: number): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_module")
    .select("module_id, module_catalogname")
    .eq("technology_id", technology_id)
    .order("module_catalogname");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ id: r.module_id, name: r.module_catalogname }));
}

export async function getSubmodulesApi(module_id: number): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_submodule")
    .select("submodule_id, subm_catalog_name")
    .eq("module_id", module_id)
    .order("subm_catalog_name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ id: r.submodule_id, name: r.subm_catalog_name }));
}