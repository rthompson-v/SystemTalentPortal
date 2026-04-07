// features/talent/api.ts
import { supabase } from "../../../SupabaseClient";
import { useAuth } from "../auth/useAuth";
import type {
  Talent, CreateTalent, UpdateTalent, CatalogItem,
  PaginatedResponse, SearchPayload, SearchResponse,
} from "./types";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getRoleId(): number {
  const user = useAuth.getState().user;
  return user?.Role_CLP ?? 0;
}

function assertRpc(data: unknown, error: unknown, label: string) {
  if (error) throw new Error(`${label}: ${(error as { message: string }).message}`);
  if ((data as { ok?: boolean })?.ok === false)
    throw new Error(`${label}: ${(data as { error?: string }).error ?? "Error desconocido"}`);
}

// ── Interfaces para catálogos ─────────────────────────────────────────────────
interface RoleRow       { role_id: number;              name: string }
interface LocationRow   { location_id: number;          name: string }
interface TechnologyRow { technology_id: number;        ct_name_tech: string }
interface HiringPrefRow { hiring_preference_id: number; name: string }
interface ModuleRow     { module_id: number;            module_catalogname: string }
interface SubmoduleRow  { submodule_id: number;         subm_catalog_name: string }

// ── Lista paginada ────────────────────────────────────────────────────────────
export async function listTalentApi(page = 1, limit = 20): Promise<PaginatedResponse> {
  const { data, error } = await supabase.rpc("profile_view_by_role", {
    p_role_id: getRoleId(),
    p_limit:   limit,
    p_page:    page,
  });
  assertRpc(data, error, "listTalentApi");
  return data as PaginatedResponse;
}

// ── Búsqueda ──────────────────────────────────────────────────────────────────
export async function searchTalentApi(payload: SearchPayload & { tech?: string }): Promise<SearchResponse> {
  const { data, error } = await supabase.rpc("search_candidates", {
    p_q:       payload.q     ?? "",
    p_limit:   payload.limit ?? 50,
    p_role_id: getRoleId(),
    p_tech:    payload.tech  ?? "",
  });
  assertRpc(data, error, "searchTalentApi");
  return data as SearchResponse;
}

// ── Detalle ───────────────────────────────────────────────────────────────────
export async function getTalentApi(candidate_code: string): Promise<Talent> {
  const { data, error } = await supabase.rpc("get_candidate_by_code", {
    p_candidate_code: candidate_code,
  });
  assertRpc(data, error, "getTalentApi");
  return (data as { data: Talent }).data;
}

// ── Crear ─────────────────────────────────────────────────────────────────────
export async function createTalentApi(payload: CreateTalent): Promise<{ candidate_id: number; candidate_code: string }> {
  const { data, error } = await supabase.rpc("add_candidate_full", {
    p_data: {
      Name:             payload.Name,
      Telefono:         payload.Telefono        ?? null,
      Email:            payload.Email           ?? null,
      CV:               payload.CV              ?? null,
      Rol:              payload.Rol,
      Location:         payload.Location        ?? null,
      EnglishLevel:     payload.EnglishLevel    ?? null,
      Experiencia:      payload.Experiencia     ?? null,
      Expectativas:     payload.Expectativas    ?? null,
      Skillset:         payload.Skillset        ?? null,
      Visa:             payload.Visa            ?? null,
      HiringPreference: payload.HiringPreference ?? null,
      Modulos:          Array.isArray(payload.Modulos) ? payload.Modulos : [],
    },
  });
  assertRpc(data, error, "createTalentApi");
  return data as { candidate_id: number; candidate_code: string };
}

// ── Actualizar ────────────────────────────────────────────────────────────────
export async function updateTalentApi(
  candidate_code: string,
  payload: UpdateTalent
): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await supabase.rpc("update_candidate_by_code", {
    p_candidate_code: candidate_code,
    p_name:           payload.Name             ?? null,
    p_telefono:       payload.Telefono         ?? null,
    p_email:          payload.Email            ?? null,
    p_cv:             payload.CV               ?? null,
    p_location:       payload.Location         ?? null,
    p_rol:            payload.Rol              ?? null,
    p_english_level:  payload.EnglishLevel     ?? null,
    p_experiencia:    payload.Experiencia      ?? null,
    p_expectativas:   payload.Expectativas     ?? null,
    p_skillset:       payload.Skillset         ?? null,
    p_visa:           payload.Visa             ?? null,
    p_hiring_pref:    payload.HiringPreference ?? null,
    p_technologies:   Array.isArray(payload.Tecnologia)
                        ? payload.Tecnologia
                        : payload.Tecnologia ? [payload.Tecnologia] : null,
    p_replace_stack:  payload.replaceStack     ?? false,
  });
  assertRpc(data, error, "updateTalentApi");
  return data as { ok: boolean; message: string };
}

// ── Catálogos ─────────────────────────────────────────────────────────────────
export async function getRolesApi(): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_role").select("role_id, name").order("name");
  if (error) throw new Error(error.message);
  return (data as RoleRow[] ?? []).map((r) => ({ id: r.role_id, name: r.name }));
}

export async function getLocationsApi(): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_location").select("location_id, name").order("name");
  if (error) throw new Error(error.message);
  return (data as LocationRow[] ?? []).map((r) => ({ id: r.location_id, name: r.name }));
}

export async function getTechnologiesApi(): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_technology").select("technology_id, ct_name_tech").order("ct_name_tech");
  if (error) throw new Error(error.message);
  return (data as TechnologyRow[] ?? []).map((r) => ({ id: r.technology_id, name: r.ct_name_tech }));
}

export async function getHiringPreferencesApi(): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_hiring_preference").select("hiring_preference_id, name").order("hiring_preference_id");
  if (error) throw new Error(error.message);
  return (data as HiringPrefRow[] ?? []).map((r) => ({ id: r.hiring_preference_id, name: r.name }));
}

export async function getModulesApi(technology_id: number): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_module").select("module_id, module_catalogname")
    .eq("technology_id", technology_id).order("module_catalogname");
  if (error) throw new Error(error.message);
  return (data as ModuleRow[] ?? []).map((r) => ({ id: r.module_id, name: r.module_catalogname }));
}

export async function getSubmodulesApi(module_id: number): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from("catalog_submodule").select("submodule_id, subm_catalog_name")
    .eq("module_id", module_id).order("subm_catalog_name");
  if (error) throw new Error(error.message);
  return (data as SubmoduleRow[] ?? []).map((r) => ({ id: r.submodule_id, name: r.subm_catalog_name }));
}