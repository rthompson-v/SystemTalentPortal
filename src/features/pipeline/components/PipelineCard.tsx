import { useNavigate } from "react-router-dom";
import type { PipelineCandidate } from "../types";

interface Props {
  candidate:   PipelineCandidate;
  stageId:     number;
  onDragStart: (candidate: PipelineCandidate, fromStageId: number) => void;
}

function cefrLabel(score?: number): string {
  if (score == null) return "—";
  if (score <= 20)  return "A1";
  if (score <= 40)  return "A2";
  if (score <= 55)  return "B1";
  if (score <= 70)  return "B2";
  if (score <= 85)  return "C1";
  return "C2";
}

function cefrColor(score?: number): string {
  if (score == null) return "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400";
  if (score <= 40)  return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
  if (score <= 70)  return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
}

function getInitials(name: string): string {
  return name.split(/[\s._-]/).map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function PipelineCard({ candidate, stageId, onDragStart }: Props) {
  const navigate  = useNavigate();
  const techs     = candidate.technologies?.split(", ").filter(Boolean) ?? [];
  const maxTechs  = 3;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(candidate, stageId)}
      onClick={() => navigate(`/talent/edit/${candidate.candidate_code}`)}
      className="bg-white dark:bg-slate-800 rounded-xl p-3.5 shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-[#135bec]/40 transition-all select-none group"
    >
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="size-8 rounded-full bg-[#135bec] text-white flex items-center justify-center text-xs font-bold shrink-0">
          {getInitials(candidate.full_name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
            {candidate.full_name}
          </p>
          {candidate.role && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {candidate.role}
            </p>
          )}
        </div>
        {/* Quick edit button */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/talent/edit/${candidate.candidate_code}`); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-[#135bec] hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          title="Editar candidato"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
        </button>
      </div>

      {/* Tech badges */}
      {techs.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {techs.slice(0, maxTechs).map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md"
            >
              {t}
            </span>
          ))}
          {techs.length > maxTechs && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-md">
              +{techs.length - maxTechs}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${cefrColor(candidate.english_score)}`}>
          {cefrLabel(candidate.english_score)}
        </span>
        {candidate.email && (
          <a
            href={`mailto:${candidate.email}`}
            onClick={(e) => e.stopPropagation()}
            className="text-slate-400 hover:text-[#135bec] transition-colors"
            title={candidate.email}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>mail</span>
          </a>
        )}
      </div>
    </div>
  );
}
