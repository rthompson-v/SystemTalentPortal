// ── Campos que devuelve la API ────────────────────────────────────────────────
export interface Talent {
  candidate_id?:        number;
  candidate_code?:      string;
  full_name:            string;
  email?:               string;
  phone?:               string;
  location?:            string;
  years_experience?:    number;
  skillset?:            string;
  technologies?:        string;
  english_score?:       number;  // 0-100
  linkedin?:            string;
  cv?:                  string;
  tarifa?:              string;
  costo_expectativa?:   string;
  last_update?:         string;
  hiring_preference?:   string;
}

// ── Payload búsqueda avanzada (POST /candidates/search) ───────────────────────
export interface SearchPayload {
  q?:            string;   // texto libre
  limit?:        number;
}

// ── Payload para POST /candidates (Alta) ─────────────────────────────────────
export interface CreateTalent {
  Name:              string;
  Rol:               string;
  Telefono?:         string;
  Email?:            string;
  Skillset?:         string | string[];
  EnglishLevel?:     number;
  Experiencia?:      number;
  Location?:         string;
  Visa?:             string;
  HiringPreference?: string;   // Temporal | Permanente | Ambas
  Expectativas?:     string;
  CV?:               string;
  Linkedin?:         string;
  Tecnologia?:       string | string[];
  Modulos?:          ModuloInput[];
}

// ── Payload para PUT /candidates/update/:candidate_code ───────────────────────
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

// ── Paginación ────────────────────────────────────────────────────────────────
export interface PaginatedResponse {
  ok:         boolean;
  data:       Talent[];
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
}

// ── Respuesta búsqueda ────────────────────────────────────────────────────────
export interface SearchResponse {
  ok:    boolean;
  data:  Talent[];
  count: number;
  q:     string;
  tier:  string;
}