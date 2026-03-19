import { useState } from "react";
import { useSearchTalent } from "../hooks";
import TalentLayout from "../components/TalentLayout";
import TalentTable from "../components/TalentTable";
import SearchPanel, { type SearchFilters } from "../components/SearchPanel";
import type { Talent } from "../types";

export function TalentListPage() {
  const search = useSearchTalent();
  const [results, setResults]     = useState<Talent[] | null>(null); // null = sin buscar aún
  const [lastQuery, setLastQuery] = useState<SearchFilters | null>(null);

  // ── Construir query string para el backend ─────────────────────────────────
  function buildQuery(f: SearchFilters): string {
    const parts: string[] = [];

    if (f.q.trim())          parts.push(f.q.trim());
    if (f.skill.trim())      parts.push(f.skill.trim());
    if (f.tecnologia.trim()) parts.push(`skillset:${f.tecnologia.trim()}`);
    if (f.modulo.trim())     parts.push(f.modulo.trim());
    if (f.submodulo.trim())  parts.push(f.submodulo.trim());

    // Inglés: si tienen rango lo convertimos a un valor medio para el sort numérico del backend
    if (f.englishMin.trim() || f.englishMax.trim()) {
      const min = Number(f.englishMin) || 0;
      const max = Number(f.englishMax) || 100;
      parts.push(`english:${Math.round((min + max) / 2)}`);
    }

    return parts.join(" ");
  }

  // ── Filtro de inglés en cliente (el backend no soporta rango) ─────────────
  function applyClientFilters(data: Talent[], f: SearchFilters): Talent[] {
    return data.filter((t) => {
      const min = f.englishMin !== "" ? Number(f.englishMin) : 0;
      const max = f.englishMax !== "" ? Number(f.englishMax) : 100;
      const score = t.english_score ?? null;
      if (score === null && (f.englishMin !== "" || f.englishMax !== "")) return false;
      if (score !== null && (score < min || score > max)) return false;
      return true;
    });
  }

  const handleSearch = async (filters: SearchFilters) => {
    const isEmpty = Object.values(filters).every((v) => v === "");
    if (isEmpty) {
      setResults(null);
      setLastQuery(null);
      return;
    }

    setLastQuery(filters);
    const q = buildQuery(filters);
    const res = await search.mutateAsync({ q, limit: 100 });
    setResults(applyClientFilters(res.data, filters));
  };

  const hasSearched = results !== null;

  return (
    <TalentLayout>
      <div className="p-6 md:p-8">

        {/* Search Panel */}
        <SearchPanel onSearch={handleSearch} isLoading={search.isPending} />

        {/* Error */}
        {search.isError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 mb-6">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
            <p className="text-sm font-medium">Error al buscar candidatos. Intenta de nuevo.</p>
          </div>
        )}

        {/* ── Estado: sin buscar aún ── */}
        {!hasSearched && !search.isPending && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#135bec]/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#135bec]" style={{ fontSize: 32 }}>
                manage_search
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Usa los filtros para buscar candidatos
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
              Puedes buscar por nombre, email, skill, tecnología, módulo, submódulo
              o rango de puntaje de inglés.
            </p>
          </div>
        )}

        {/* ── Loading ── */}
        {search.isPending && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>
              progress_activity
            </span>
            <span className="text-sm">Buscando candidatos…</span>
          </div>
        )}

        {/* ── Resultados ── */}
        {hasSearched && !search.isPending && (
          <>
            {/* Result header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Resultados
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  {results!.length === 0
                    ? "No se encontraron candidatos"
                    : `${results!.length} candidato${results!.length !== 1 ? "s" : ""} encontrado${results!.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              {results!.length > 0 && (
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Mostrando los primeros 100 resultados
                </span>
              )}
            </div>

            {/* Empty results */}
            {results!.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 mb-3" style={{ fontSize: 40 }}>
                  search_off
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                  Sin resultados
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Intenta con otros términos de búsqueda.
                </p>
              </div>
            ) : (
              <TalentTable talents={results!} />
            )}
          </>
        )}

      </div>
    </TalentLayout>
  );
}