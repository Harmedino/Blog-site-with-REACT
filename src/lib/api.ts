import axios, { AxiosError } from "axios";
import { getToken } from "./auth-token";

export const API_URL = (import.meta.env.VITE_API_URL || "https://blog-backend-node-7kjl.onrender.com").replace(
  /\/$/,
  "",
);

export const api = axios.create({ baseURL: API_URL, timeout: 60_000 });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Fired when the API rejects our token, so the auth layer can sign the user out. */
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

api.interceptors.response.use(undefined, (error: AxiosError) => {
  const status = error.response?.status;
  if ((status === 401 || status === 403) && getToken()) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
  return Promise.reject(error);
});

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown; error?: unknown } | undefined;
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
    if (error.code === "ECONNABORTED") return "The server took too long to respond. It may be waking up — try again.";
    if (!error.response) return "Can't reach the server. Check your connection and try again.";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
