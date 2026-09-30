import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UNAUTHORIZED_EVENT } from "@/lib/api";
import { clearToken, getToken, isTokenExpired, setToken, tokenExpiry } from "@/lib/auth-token";
import { AuthContext, type AuthContextValue } from "./auth-context";
import { fetchMe, login as loginRequest, type LoginInput } from "./api";

function initialToken() {
  const token = getToken();
  if (token && isTokenExpired(token)) {
    clearToken();
    return null;
  }
  return token;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(initialToken);

  const me = useQuery({
    queryKey: ["me", token],
    queryFn: fetchMe,
    enabled: !!token,
    staleTime: 5 * 60_000,
    retry: false,
  });

  const logout = useCallback(
    (reason?: string) => {
      clearToken();
      setTokenState(null);
      queryClient.removeQueries({ queryKey: ["me"] });
      if (reason) toast.info(reason);
    },
    [queryClient],
  );

  const login = useCallback(async (input: LoginInput) => {
    const { token: newToken } = await loginRequest(input);
    setToken(newToken);
    setTokenState(newToken);
  }, []);

  // Sign out automatically when the JWT expires.
  useEffect(() => {
    if (!token) return;
    const exp = tokenExpiry(token);
    if (!exp) return;
    const timer = setTimeout(() => logout("Your session expired. Please sign in again."), Math.max(0, exp - Date.now()));
    return () => clearTimeout(timer);
  }, [token, logout]);

  // Sign out when the API rejects our token.
  useEffect(() => {
    const onUnauthorized = () => logout("Your session expired. Please sign in again.");
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [logout]);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") setTokenState(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: me.data,
      isLoadingUser: !!token && me.isPending,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token, me.data, me.isPending, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
