import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./auth-context";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?mode=login&redirect=${redirect}`} replace />;
  }
  return children;
}
