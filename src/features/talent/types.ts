// ── Campos que devuelve la API (v_candidate_profile) ──────────────────────────
export interface Talent {
  candidate_id?:   number;
  candidate_code?: string;
  full_name:       string;
  email?:          string;
  phone?:          string;
  location?:       string;
  years_experience?: number;
  skillset?:       string;   // comma-separated
  english_score?:  number;   // 0-100
  linkedin?:       string;
  cv?:             string;   // URL
  tarifa?:         string;
  costo_expectativa?: string;
  last_update?:    string;
}

// ── Payload para POST /candidates (Alta) ─────────────────────────────────────
export interface CreateTalent {
  Nombre:       string;
  Telefono?:    string;
  Email?:       string;
  Rol?:         string;
  Skillset?:    string | string[];
  EnglishLevel?: number;       // 0-100
  Experiencia?: number;
  Location?:    string;
  Visa?:        string;        // "Yes" | "No" | "In Progress"
  Esquema?:     string;        // "Remote" | "Hybrid" | "On-site"
  Expectativas?: string;       // costo/salario esperado
  CV?:          string;
  Tecnologia?:  string | string[];
  Modulos?:     ModuloInput[];
}

// ── Payload para PUT /candidates/update/:candidate_code (Editar) ──────────────
export type UpdateTalent = Partial<CreateTalent> & {
  replaceStack?: boolean;
};

// ── Módulo en el stack ────────────────────────────────────────────────────────
export interface ModuloInput {
  technology: string;
  module?:    string;
  submodule?: string;
}

// ── Catálogos ─────────────────────────────────────────────────────────────────
export interface CatalogItem {
  id:   number;
  name: string;
}