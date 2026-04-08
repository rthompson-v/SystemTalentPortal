import { useMemo, useState } from "react";
import TalentLayout from "../../talent/components/TalentLayout";
import PipelineBoard from "../components/PipelineBoard";
import AddToPipelineModal from "../components/AddToPipelineModal";
import { usePipelineBoard } from "../hooks";
import type { PipelineStage } from "../types";

const ALL_STAGES = 0;

function filterStages(stages: PipelineStage[], query: string, stageFilter: number): PipelineStage[] {
  const q = query.trim().toLowerCase();
  return stages
    .filter((s) => stageFilter === ALL_STAGES || s.stage_id === stageFilter)
    .map((stage) => ({
      ...stage,
      candidates: q
        ? stage.candidates.filter((c) =>
            c.full_name.toLowerCase().includes(q) ||
            c.role?.toLowerCase().includes(q) ||
            c.technologies?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q)
          )
        : stage.candidates,
    }));
}

export default function PipelinePage() {
  const { data: stages, isLoading, isError } = usePipelineBoard();
  const [query,       setQuery]       = useState("");
  const [stageFilter, setStageFilter] = useState(ALL_STAGES);
  const [showModal,   setShowModal]   = useState(false);

  const filteredStages = useMemo(
    () => (stages ? filterStages(stages, query, stageFilter) : []),
    [stages, query, stageFilter]
  );

  const totalAll     = stages?.reduce((s, st) => s + st.candidates.length, 0) ?? 0;
  const totalMatch   = filteredStages.reduce((s, st) => s + st.candidates.length, 0);
  const isFiltering  = query.trim() !== "" || stageFilter !== ALL_STAGES;

  return (
    <TalentLayout>
      {/* El contenedor ocupa toda la altura disponible y NO hace scroll propio */}
      <div className="flex flex-col h-full">

        {/* ── Header fijo ───────────────────────────────────────────────────── */}
        <div className="px-6 pt-5 pb-4 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pipeline</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Arrastra los candidatos entre etapas para avanzarlos en el proceso
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Contador */}
              {stages && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {isFiltering ? (
                    <><span className="font-semibold text-slate-900 dark:text-slate-100">{totalMatch}</span> de <span className="font-semibold">{totalAll}</span></>
                  ) : (
                    <><span className="font-semibold text-slate-900 dark:text-slate-100">{totalAll}</span> en pipeline</>
                  )}
                </span>
              )}

              {/* Botón agregar */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 bg-[#135bec] text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#135bec]/90 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                Agregar candidato
              </button>
            </div>
          </div>

          {/* ── Filtros ───────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-52 max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 17 }}>
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, rol, tecnología…"
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-[#135bec]/50 focus:ring-2 focus:ring-[#135bec]/20 rounded-lg outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </button>
              )}
            </div>

            {/* Selector de etapa */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 16 }}>
                filter_list
              </span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(Number(e.target.value))}
                className="pl-8 pr-8 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-[#135bec]/50 focus:ring-2 focus:ring-[#135bec]/20 rounded-lg outline-none text-slate-700 dark:text-slate-300 appearance-none cursor-pointer transition-all"
              >
                <option value={ALL_STAGES}>Todas las etapas</option>
                {stages?.map((s) => (
                  <option key={s.stage_id} value={s.stage_id}>
                    {s.name} ({s.candidates.length})
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 16 }}>
                expand_more
              </span>
            </div>

            {/* Limpiar filtros */}
            {isFiltering && (
              <button
                onClick={() => { setQuery(""); setStageFilter(ALL_STAGES); }}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* ── Board — scroll horizontal aquí, vertical dentro de cada columna ── */}
        <div className="flex-1 min-h-0 overflow-hidden bg-[#f5f7f8] dark:bg-[#0b0f17]">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-slate-400 gap-2">
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: 22 }}>progress_activity</span>
              Cargando pipeline…
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center h-full text-red-500 gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>error</span>
              Error al cargar el pipeline. Intenta de nuevo.
            </div>
          )}

          {stages && (
            isFiltering && totalMatch === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 40 }}>search_off</span>
                <p className="text-sm font-medium">Sin resultados para "{query}"</p>
                <button
                  onClick={() => { setQuery(""); setStageFilter(ALL_STAGES); }}
                  className="text-sm text-[#135bec] hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : totalAll === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                <span className="material-symbols-outlined" style={{ fontSize: 48 }}>view_kanban</span>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">El pipeline está vacío</p>
                <p className="text-xs text-slate-400">Agrega candidatos desde el Talent Pool para comenzar a trackear su proceso</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-1 flex items-center gap-1.5 bg-[#135bec] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#135bec]/90 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                  Agregar candidato
                </button>
              </div>
            ) : (
              <PipelineBoard stages={filteredStages} />
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && <AddToPipelineModal onClose={() => setShowModal(false)} />}
    </TalentLayout>
  );
}
