import { useEffect, useRef, useState } from "react";
import { useAddCandidateToPipeline, useSearchCandidatesForPipeline } from "../hooks";
import type { PipelineCandidate } from "../types";

interface Props {
  onClose: () => void;
}

function cefrLabel(score?: number) {
  if (score == null) return "—";
  if (score <= 20) return "A1";
  if (score <= 40) return "A2";
  if (score <= 55) return "B1";
  if (score <= 70) return "B2";
  if (score <= 85) return "C1";
  return "C2";
}

function ResultRow({
  candidate,
  onAdd,
  adding,
  added,
}: {
  candidate:  PipelineCandidate;
  onAdd:      (code: string) => void;
  adding:     boolean;
  added:      boolean;
}) {
  const techs = candidate.technologies?.split(", ").filter(Boolean).slice(0, 3) ?? [];

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
      {/* Avatar */}
      <div className="size-9 rounded-full bg-[#135bec] text-white flex items-center justify-center text-xs font-bold shrink-0">
        {candidate.full_name.split(/[\s._-]/).map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
          {candidate.full_name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {candidate.role && (
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{candidate.role}</span>
          )}
          {techs.map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
              {t}
            </span>
          ))}
          <span className="text-[10px] font-semibold text-slate-400">
            {cefrLabel(candidate.english_score)}
          </span>
        </div>
      </div>

      {/* Action */}
      {added ? (
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shrink-0">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
          Agregado
        </span>
      ) : (
        <button
          onClick={() => onAdd(candidate.candidate_code)}
          disabled={adding}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#135bec] text-white hover:bg-[#135bec]/90 disabled:opacity-50 transition-colors"
        >
          {adding
            ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span>
            : <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
          }
          Agregar
        </button>
      )}
    </div>
  );
}

export default function AddToPipelineModal({ onClose }: Props) {
  const [query,   setQuery]   = useState("");
  const [added,   setAdded]   = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);

  const inputRef   = useRef<HTMLInputElement>(null);
  const addMutation = useAddCandidateToPipeline();
  const { data: results = [], isFetching } = useSearchCandidatesForPipeline(query);

  // Focus al abrir
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleAdd(code: string) {
    setPending(code);
    addMutation.mutate(code, {
      onSuccess: () => {
        setAdded((prev) => new Set(prev).add(code));
        setPending(null);
      },
      onError: () => setPending(null),
    });
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[80vh]">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <span className="material-symbols-outlined text-[#135bec]" style={{ fontSize: 22 }}>person_search</span>
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Agregar al pipeline</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Candidatos no asignados a ninguna etapa</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Search input */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 18 }}>
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, rol o tecnología…"
              className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-100 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-[#135bec]/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
            />
            {isFetching && (
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" style={{ fontSize: 16 }}>
                progress_activity
              </span>
            )}
            {!isFetching && query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {results.length === 0 && !isFetching && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
                {query ? "search_off" : "groups"}
              </span>
              <p className="text-sm">
                {query ? `Sin resultados para "${query}"` : "Todos los candidatos ya están en el pipeline"}
              </p>
            </div>
          )}

          {results.map((candidate) => (
            <ResultRow
              key={candidate.candidate_code}
              candidate={candidate}
              onAdd={handleAdd}
              adding={pending === candidate.candidate_code}
              added={added.has(candidate.candidate_code)}
            />
          ))}
        </div>

        {/* Footer */}
        {added.size > 0 && (
          <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{added.size}</span>
              {" "}candidato{added.size !== 1 ? "s" : ""} agregado{added.size !== 1 ? "s" : ""} a <strong>Sin contactar</strong>. Puedes arrastrarlos a otra etapa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
