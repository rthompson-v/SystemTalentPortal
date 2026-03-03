import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTalentApi, listTalentApi } from "./api";

export function useTalentList() {
  return useQuery({ queryKey: ["talent"], queryFn: listTalentApi });
}

export function useCreateTalent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTalentApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["talent"] }),
  });
}