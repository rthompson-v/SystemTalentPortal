import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPipelineBoard, moveCandidateToStage, searchCandidatesForPipeline } from "./pipeline.service";
import type { PipelineCandidate, PipelineStage } from "./types";

const PIPELINE_KEY = ["pipeline", "board"] as const;

export function usePipelineBoard() {
  return useQuery({
    queryKey: PIPELINE_KEY,
    queryFn:  () => getPipelineBoard(),
  });
}

export function useSearchCandidatesForPipeline(q: string) {
  return useQuery({
    queryKey: ["pipeline", "search", q],
    queryFn:  () => searchCandidatesForPipeline(q),
    staleTime: 10_000,
  });
}

export function useAddCandidateToPipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => moveCandidateToStage(code, 1),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PIPELINE_KEY });
      qc.invalidateQueries({ queryKey: ["pipeline", "search"] });
    },
  });
}

export function useMoveCandidateToStage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ code, stageId }: { code: string; stageId: number }) =>
      moveCandidateToStage(code, stageId),

    onMutate: async ({ code, stageId }) => {
      await qc.cancelQueries({ queryKey: PIPELINE_KEY });
      const previous = qc.getQueryData<PipelineStage[]>(PIPELINE_KEY);

      qc.setQueryData<PipelineStage[]>(PIPELINE_KEY, (old) => {
        if (!old) return old;
        let moved: PipelineCandidate | undefined;

        const cleared = old.map((stage) => ({
          ...stage,
          candidates: stage.candidates.filter((c) => {
            if (c.candidate_code === code) { moved = c; return false; }
            return true;
          }),
        }));

        if (!moved) return cleared;

        return cleared.map((stage) =>
          stage.stage_id === stageId
            ? { ...stage, candidates: [moved!, ...stage.candidates] }
            : stage
        );
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(PIPELINE_KEY, ctx.previous);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: PIPELINE_KEY }),
  });
}
