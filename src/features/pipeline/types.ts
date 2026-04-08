export interface PipelineCandidate {
  candidate_id:   number;
  candidate_code: string;
  full_name:      string;
  email?:         string;
  english_score?: number;
  role?:          string;
  technologies?:  string;
  updated_at?:    string;
}

export interface PipelineStage {
  stage_id:   number;
  name:       string;
  color:      string;
  position:   number;
  candidates: PipelineCandidate[];
}
