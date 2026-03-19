import { http } from "../../shared/api/http";
import type {
  Talent, CreateTalent, UpdateTalent, CatalogItem,
  PaginatedResponse, SearchPayload, SearchResponse,
} from "./types";

interface SingleResponse  { ok: boolean; data: { candidate: Talent } }
interface UpdateResponse  { ok: boolean; candidate_code: string; message: string }
interface CatalogResponse { ok: boolean; data: CatalogItem[] }

// ── Lista paginada ────────────────────────────────────────────────────────────
export async function listTalentApi(page = 1, limit = 20): Promise<PaginatedResponse> {
  const { data } = await http.post<PaginatedResponse>(
    "/candidates/profile-view-by-role",
    { page, limit }
  );
  return data;
}

// ── Búsqueda avanzada ─────────────────────────────────────────────────────────
export async function searchTalentApi(payload: SearchPayload): Promise<SearchResponse> {
  const { data } = await http.post<SearchResponse>("/candidates/search", {
    q:     payload.q     ?? "",
    limit: payload.limit ?? 50,
  });
  return data;
}

// ── Detalle ───────────────────────────────────────────────────────────────────
export async function getTalentApi(candidate_code: string): Promise<Talent> {
  const { data } = await http.get<SingleResponse>(`/candidates/${candidate_code}`);
  return data.data.candidate;
}

// ── Crear ─────────────────────────────────────────────────────────────────────
export async function createTalentApi(payload: CreateTalent): Promise<Talent> {
  const { data } = await http.post<{ ok: boolean; data: Talent }>("/candidates", payload);
  return data.data;
}

// ── Actualizar ────────────────────────────────────────────────────────────────
export async function updateTalentApi(
  candidate_code: string,
  payload: UpdateTalent
): Promise<UpdateResponse> {
  const { data } = await http.put<UpdateResponse>(
    `/candidates/update/${candidate_code}`,
    payload
  );
  return data;
}

// ── Catálogos ─────────────────────────────────────────────────────────────────
export async function getRolesApi(): Promise<CatalogItem[]> {
  const { data } = await http.get<CatalogResponse>("/candidates/catalogs/roles");
  return data.data;
}

export async function getLocationsApi(): Promise<CatalogItem[]> {
  const { data } = await http.get<CatalogResponse>("/candidates/catalogs/locations");
  return data.data;
}

export async function getTechnologiesApi(): Promise<CatalogItem[]> {
  const { data } = await http.get<CatalogResponse>("/candidates/catalogs/technologies");
  return data.data;
}

export async function getHiringPreferencesApi(): Promise<CatalogItem[]> {
  const { data } = await http.get<CatalogResponse>("/candidates/catalogs/hiring-preferences");
  return data.data;
}

export async function getModulesApi(technology_id: number): Promise<CatalogItem[]> {
  const { data } = await http.get<CatalogResponse>(
    `/candidates/catalogs/technologies/${technology_id}/modules`
  );
  return data.data;
}

export async function getSubmodulesApi(module_id: number): Promise<CatalogItem[]> {
  const { data } = await http.get<CatalogResponse>(
    `/candidates/catalogs/modules/${module_id}/submodules`
  );
  return data.data;
}