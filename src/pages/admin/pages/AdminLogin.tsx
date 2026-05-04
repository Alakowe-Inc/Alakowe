import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_CREDENTIALS, setAdminAuthed } from "@/pages/admin/AdminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
      ) {
        setAdminAuthed(true);
        navigate("/admin", { replace: true });
      } else {
        setError("Invalid admin credentials");
        setLoading(false);
      }
    }, 350);
  }

  return (
    <div className="min-h-screen bg-[#172131] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-2xl shadow-elegant p-8 sm:p-10 border border-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-11 w-11 rounded-xl bg-secondary text-white flex items-center justify-center shadow-glow">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">
                Admin Console
              </h1>
              <p className="text-xs text-muted-foreground">
                Restricted — staff only
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="admin@alakowe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in to admin"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              ← Back to site
            </Link>
            <Link to="/login" className="hover:text-foreground">
              User login
            </Link>
          </div>

          <div className="mt-6 rounded-lg bg-muted px-3 py-2 text-[11px] text-muted-foreground">
            Demo credentials: <strong>{ADMIN_CREDENTIALS.email}</strong> /{" "}
            <strong>{ADMIN_CREDENTIALS.password}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
