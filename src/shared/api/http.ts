import axios from "axios";
import { env } from "../lib/env";
import { authStorage } from "./authStorage";

export const http = axios.create({
  baseURL: env.apiUrl,
});

http.interceptors.request.use((config) => {
  const token = authStorage.get();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});