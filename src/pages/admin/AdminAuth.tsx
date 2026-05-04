import { Navigate, useLocation } from "react-router-dom";

const STORAGE_KEY = "alakowe_admin_authed";

export const ADMIN_CREDENTIALS = {
  email: "admin@alakowe.com",
  password: "admin123",
};

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function setAdminAuthed(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) window.localStorage.setItem(STORAGE_KEY, "true");
  else window.localStorage.removeItem(STORAGE_KEY);
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isAdminAuthed()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
