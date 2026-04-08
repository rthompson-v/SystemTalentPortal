import { useRef } from "react";
import type { PipelineCandidate, PipelineStage } from "../types";
import PipelineColumn from "./PipelineColumn";
import { useMoveCandidateToStage } from "../hooks";

interface Props {
  stages: PipelineStage[];
}

export default function PipelineBoard({ stages }: Props) {
  const moveStage  = useMoveCandidateToStage();
  const dragging   = useRef<{ candidate: PipelineCandidate; fromStageId: number } | null>(null);

  function handleDragStart(candidate: PipelineCandidate, fromStageId: number) {
    dragging.current = { candidate, fromStageId };
  }

  function handleDrop(toStageId: number) {
    const drag = dragging.current;
    dragging.current = null;
    if (!drag || drag.fromStageId === toStageId) return;
    moveStage.mutate({ code: drag.candidate.candidate_code, stageId: toStageId });
  }

  return (
    <div className="flex gap-4 h-full overflow-x-auto px-6 py-6">
      {stages.map((stage) => (
        <PipelineColumn
          key={stage.stage_id}
          stage={stage}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
