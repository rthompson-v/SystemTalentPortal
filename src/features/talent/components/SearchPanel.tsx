import { useState } from "react";
import { useTechnologies, useModules, useSubmodules } from "../hooks";

export interface SearchFilters {
  q:           string;   // nombre o email (texto libre)
  technologies: string;  // tecnología texto libre
  englishMin:  string;   // 0-100
  englishMax:  string;   // 0-100
}

const EMPTY: SearchFilters = {
  q: "", technologies: "", englishMin: "", englishMax: "",
};

interface Props {
  onSearch:  (filters: SearchFilters) => void;
  isLoading: boolean;
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all text-sm";
const labelCls = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider";

export default function SearchPanel({ onSearch, isLoading }: Props) {

  const [filters, setFilters] = useState<SearchFilters>(EMPTY);
  const set = (key: keyof SearchFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };


  const handleClear = () => {
    setFilters(EMPTY);
    onSearch(EMPTY);
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6"
    >
      {/* Title */}
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-[#135bec]" style={{ fontSize: 20 }}>
          manage_search
        </span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Búsqueda de Candidatos
        </h3>
        {hasFilters && (
          <span className="ml-auto text-xs text-[#135bec] font-semibold bg-[#135bec]/10 px-2 py-0.5 rounded-full">
            Filtros activos
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Nombre / Email */}
        <div className="sm:col-span-2">
          <label className={labelCls}>Nombre o Email</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 16 }}>
              person_search
            </span>
            <input
              className={`${inputCls} pl-9`}
              type="text"
              placeholder="John Doe o john@example.com…"
              value={filters.q}
              onChange={(e) => set("q", e.target.value)}
            />
          </div>
        </div>

        {/* Tecnología */}
        <div>
          <label className={labelCls}>Tecnología</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 16 }}>
              code
            </span>
            <input
              className={`${inputCls} pl-9`}
              type="text"
              placeholder="React, AWS, SAP…"
              value={filters.technologies}
              onChange={(e) => set("technologies", e.target.value)}
            />
          </div>
        </div>

        {/* English Score range */}
        <div>
          <label className={labelCls}>English Score</label>
          <div className="flex items-center gap-2">
            <input
              className={inputCls}
              type="number"
              min={0} max={100}
              placeholder="Min"
              value={filters.englishMin}
              onChange={(e) => set("englishMin", e.target.value)}
            />
            <span className="text-slate-400 text-sm shrink-0">—</span>
            <input
              className={inputCls}
              type="number"
              min={0} max={100}
              placeholder="Max"
              value={filters.englishMax}
              onChange={(e) => set("englishMax", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#135bec] text-white rounded-lg text-sm font-semibold hover:bg-[#135bec]/90 transition-colors disabled:opacity-70"
        >
          {isLoading ? (
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>
          ) : (
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>search</span>
          )}
          Buscar
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
            Limpiar
          </button>
        )}

        <p className="ml-auto text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
          Completa al menos un campo para buscar
        </p>
      </div>
    </form>
  );
}