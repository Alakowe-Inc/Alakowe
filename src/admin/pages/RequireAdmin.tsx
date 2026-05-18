import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation();
  const authed = typeof window !== "undefined" && sessionStorage.getItem("alakowe_admin_authed") === "1";
  if (!authed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
