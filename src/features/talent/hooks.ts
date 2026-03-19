import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listTalentApi, searchTalentApi, getTalentApi,
  createTalentApi, updateTalentApi,
  getRolesApi, getLocationsApi, getTechnologiesApi,
  getHiringPreferencesApi, getModulesApi, getSubmodulesApi,
} from "./api";
import type { CreateTalent, UpdateTalent, SearchPayload } from "./types";

const KEYS = {
  list:             (page: number, limit: number) => ["talent", "list", page, limit],
  detail:           (code: string)                => ["talent", "detail", code],
  roles:            ["catalogs", "roles"],
  locations:        ["catalogs", "locations"],
  technologies:     ["catalogs", "technologies"],
  hiringPrefs:      ["catalogs", "hiring-preferences"],
  modules:          (techId: number)              => ["catalogs", "modules", techId],
  submodules:       (moduleId: number)            => ["catalogs", "submodules", moduleId],
};

// ── Lista paginada ────────────────────────────────────────────────────────────
export function useTalentList(page = 1, limit = 20) {
  return useQuery({
    queryKey: KEYS.list(page, limit),
    queryFn:  () => listTalentApi(page, limit),
    placeholderData: (prev) => prev,
  });
}

// ── Búsqueda avanzada ─────────────────────────────────────────────────────────
export function useSearchTalent() {
  return useMutation({
    mutationFn: (payload: SearchPayload) => searchTalentApi(payload),
  });
}

// ── Detalle ───────────────────────────────────────────────────────────────────
export function useTalent(candidate_code: string) {
  return useQuery({
    queryKey: KEYS.detail(candidate_code),
    queryFn:  () => getTalentApi(candidate_code),
    enabled:  !!candidate_code,
  });
}

// ── Crear ─────────────────────────────────────────────────────────────────────
export function useCreateTalent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTalent) => createTalentApi(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["talent", "list"] }),
  });
}

// ── Actualizar ────────────────────────────────────────────────────────────────
export function useUpdateTalent(candidate_code: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTalent) => updateTalentApi(candidate_code, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["talent", "list"] });
      qc.invalidateQueries({ queryKey: KEYS.detail(candidate_code) });
    },
  });
}

// ── Catálogos ─────────────────────────────────────────────────────────────────
export function useRoles()            { return useQuery({ queryKey: KEYS.roles,        queryFn: getRolesApi });            }
export function useLocations()        { return useQuery({ queryKey: KEYS.locations,    queryFn: getLocationsApi });        }
export function useTechnologies()     { return useQuery({ queryKey: KEYS.technologies, queryFn: getTechnologiesApi });     }
export function useHiringPreferences(){ return useQuery({ queryKey: KEYS.hiringPrefs,  queryFn: getHiringPreferencesApi });}

export function useModules(techId?: number) {
  return useQuery({
    queryKey: KEYS.modules(techId!),
    queryFn:  () => getModulesApi(techId!),
    enabled:  !!techId,
  });
}

export function useSubmodules(moduleId?: number) {
  return useQuery({
    queryKey: KEYS.submodules(moduleId!),
    queryFn:  () => getSubmodulesApi(moduleId!),
    enabled:  !!moduleId,
  });
}