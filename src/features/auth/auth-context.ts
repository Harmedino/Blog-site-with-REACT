import { createContext, useContext } from "react";
import type { User } from "@/types";
import type { LoginInput } from "./api";

export interface AuthContextValue {
  token: string | null;
  user: User | undefined;
  /** True while we have a token but haven't loaded the user yet. */
  isLoadingUser: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: (reason?: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
