import { useMutation } from "@tanstack/react-query";
import { loginApi } from "./api";
import { authStorage } from "../../shared/api/authStorage";
import type { LoginRequest, LoginResponse } from "./types";

export function useLogin() {
  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      authStorage.set(data.token);
      // additional handling of `data.user` could happen here if needed
    },
  });
}