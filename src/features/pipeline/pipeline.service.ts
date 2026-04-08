import { supabase } from "../../../SupabaseClient";
import type { PipelineCandidate, PipelineStage } from "./types";

export async function getPipelineBoard(): Promise<PipelineStage[]> {
  const { data, error } = await supabase.rpc("get_pipeline_board", {
    p_role_id: 0,
  });
  if (error) throw new Error(error.message);
  return (data as PipelineStage[]) ?? [];
}

export async function searchCandidatesForPipeline(q: string): Promise<PipelineCandidate[]> {
  const { data, error } = await supabase.rpc("search_candidates_for_pipeline", {
    p_q:     q,
    p_limit: 25,
  });
  if (error) throw new Error(error.message);
  return (data as PipelineCandidate[]) ?? [];
}

export async function moveCandidateToStage(
  candidateCode: string,
  stageId: number
): Promise<void> {
  const { data, error } = await supabase.rpc("update_candidate_pipeline_stage", {
    p_candidate_code: candidateCode,
    p_stage_id:       stageId,
  });
  if (error) throw new Error(error.message);
  const result = data as { ok: boolean; error?: string };
  if (!result.ok) throw new Error(result.error ?? "Error al mover candidato");
}
