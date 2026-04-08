import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import {
  listTalents, searchTalents, getTalent,
  createTalent, updateTalent,
  getRoles, getLocations, getTechnologies,
  getHiringPreferences, getModules, getSubmodules,
} from "./talent.service";
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

function useRoleId() {
  return useAuth((s) => s.user?.Role_CLP ?? 0);
}

// ── Lista paginada ────────────────────────────────────────────────────────────
export function useTalentList(page = 1, limit = 20) {
  const roleId = useRoleId();
  return useQuery({
    queryKey: KEYS.list(page, limit),
    queryFn:  () => listTalents(roleId, page, limit),
    placeholderData: (prev) => prev,
  });
}

// ── Búsqueda avanzada ─────────────────────────────────────────────────────────
export function useSearchTalent() {
  const roleId = useRoleId();
  return useMutation({
    mutationFn: (payload: SearchPayload) => searchTalents(roleId, payload),
  });
}

// ── Detalle ───────────────────────────────────────────────────────────────────
export function useTalent(candidate_code: string) {
  return useQuery({
    queryKey: KEYS.detail(candidate_code),
    queryFn:  () => getTalent(candidate_code),
    enabled:  !!candidate_code,
  });
}

// ── Crear ─────────────────────────────────────────────────────────────────────
export function useCreateTalent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTalent) => createTalent(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["talent", "list"] }),
  });
}

// ── Actualizar ────────────────────────────────────────────────────────────────
export function useUpdateTalent(candidate_code: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTalent) => updateTalent(candidate_code, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["talent", "list"] });
      qc.invalidateQueries({ queryKey: KEYS.detail(candidate_code) });
    },
  });
}

// ── Catálogos ─────────────────────────────────────────────────────────────────
export function useRoles()            { return useQuery({ queryKey: KEYS.roles,        queryFn: getRoles });            }
export function useLocations()        { return useQuery({ queryKey: KEYS.locations,    queryFn: getLocations });        }
export function useTechnologies()     { return useQuery({ queryKey: KEYS.technologies, queryFn: getTechnologies });     }
export function useHiringPreferences(){ return useQuery({ queryKey: KEYS.hiringPrefs,  queryFn: getHiringPreferences });}

export function useModules(techId?: number) {
  return useQuery({
    queryKey: KEYS.modules(techId!),
    queryFn:  () => getModules(techId!),
    enabled:  !!techId,
  });
}

export function useSubmodules(moduleId?: number) {
  return useQuery({
    queryKey: KEYS.submodules(moduleId!),
    queryFn:  () => getSubmodules(moduleId!),
    enabled:  !!moduleId,
  });
}
