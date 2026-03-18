import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listTalentApi,
  getTalentApi,
  createTalentApi,
  updateTalentApi,
  getRolesApi,
  getLocationsApi,
  getTechnologiesApi,
} from "./api";
import type { CreateTalent, UpdateTalent } from "./types";

const KEYS = {
  list:         (page: number, limit: number) => ["talent", "list", page, limit],
  detail:       (code: string)                => ["talent", "detail", code],
  roles:        ["catalogs", "roles"],
  locations:    ["catalogs", "locations"],
  technologies: ["catalogs", "technologies"],
};

// ── Lista paginada ────────────────────────────────────────────────────────────
export function useTalentList(page = 1, limit = 20) {
  return useQuery({
    queryKey: KEYS.list(page, limit),
    queryFn:  () => listTalentApi(page, limit),
    placeholderData: (prev) => prev, // mantiene datos anteriores al cambiar página
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
export function useRoles()        { return useQuery({ queryKey: KEYS.roles,        queryFn: getRolesApi });        }
export function useLocations()    { return useQuery({ queryKey: KEYS.locations,    queryFn: getLocationsApi });    }
export function useTechnologies() { return useQuery({ queryKey: KEYS.technologies, queryFn: getTechnologiesApi }); }