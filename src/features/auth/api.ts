import { api } from "@/lib/api";
import type { User } from "@/types";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  firstname: string;
  lastname: string;
  username: string;
}

export interface ProfileInput {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone?: string;
}

export async function login(input: LoginInput) {
  const { data } = await api.post<{ token: string; message: string }>("/login", input);
  return data;
}

export async function register(input: RegisterInput) {
  const { data } = await api.post<{ message: string }>("/register", input);
  // The API answers some failures with HTTP 200, so check the message too.
  if (!/success/i.test(data.message ?? "")) throw new Error(data.message || "Registration failed");
  return data;
}

export async function fetchMe() {
  const { data } = await api.post<{ message: User | string }>("/verifyToken");
  if (!data.message || typeof data.message === "string") throw new Error("Could not load your account");
  return data.message;
}

export async function updateProfile(id: string, input: ProfileInput) {
  const { data } = await api.patch<{ message: string }>(`/updateUser/${id}`, input);
  return data;
}
