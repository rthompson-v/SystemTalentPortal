import { useState } from "react";
import type { PipelineCandidate, PipelineStage } from "../types";
import PipelineCard from "./PipelineCard";

interface Props {
  stage:       PipelineStage;
  onDragStart: (candidate: PipelineCandidate, fromStageId: number) => void;
  onDrop:      (toStageId: number) => void;
}

export default function PipelineColumn({ stage, onDragStart, onDrop }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className="flex flex-col w-72 shrink-0 h-full"
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => { setIsDragOver(false); onDrop(stage.stage_id); }}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1 shrink-0">
        <span
          className="size-2.5 rounded-full shrink-0"
          style={{ backgroundColor: stage.color }}
        />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1 truncate">
          {stage.name}
        </span>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full min-w-[22px] text-center">
          {stage.candidates.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto rounded-xl p-2 space-y-2 transition-colors ${
          isDragOver
            ? "bg-[#135bec]/8 border-2 border-dashed border-[#135bec]/40"
            : "bg-slate-100/60 dark:bg-slate-800/40 border-2 border-transparent"
        }`}
      >
        {stage.candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-slate-300 dark:text-slate-600">
            <span className="material-symbols-outlined mb-1" style={{ fontSize: 24 }}>person_add</span>
            <p className="text-xs">Arrastra aqui</p>
          </div>
        ) : (
          stage.candidates.map((candidate) => (
            <PipelineCard
              key={candidate.candidate_code}
              candidate={candidate}
              stageId={stage.stage_id}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
