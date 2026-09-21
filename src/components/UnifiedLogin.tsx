import React, { useState, useEffect } from "react";
import { AlertTriangle, User, Lock } from "lucide-react";
import { RecruitAuditorWordmark } from "./Logo";

interface UnifiedLoginProps {
  onLogin: (role: "admin" | "client", data: any) => void;
}

export default function UnifiedLogin({ onLogin }: UnifiedLoginProps) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);

  useEffect(() => {
    if (loginId === "hassaan123") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      setNeedsPassword(false);
      setPassword("");
    }
  }, [loginId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsPassword) {
          setNeedsPassword(true);
          throw new Error("Please enter admin password.");
        }
        throw new Error(data.error || "Login failed.");
      }
      onLogin(data.role, data);
      if (data.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/client-dashboard";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClientAccess = async () => {
    if (!loginId.trim()) {
      setError("Please enter your Client ID.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: loginId.trim(), password: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      onLogin(data.role, data);
      window.location.href = "/client-dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background scaffolds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hud-grid" />
        <div className="aurora -top-24 left-[12%] h-80 w-80 bg-[#60A5FA]/14" />
        <div className="aurora bottom-[8%] right-[8%] h-72 w-72 bg-[#4DE3FF]/8" />
      </div>

      <div className="w-full max-w-md glass-strong rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="accent-edge" />

        <div className="text-center space-y-3 pt-2">
          <div className="flex justify-center">
            <RecruitAuditorWordmark size={34} light />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold  tracking-[0.18em] text-[var(--text-primary)]">Access portal</h3>
            <p className="mt-1 text-xs font-mono text-[var(--muted)]">Client ID or admin credentials</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-[10px]  tracking-wider text-[var(--text-secondary)]">ID Number</label>
            <input
              type="text"
              required
              placeholder="Enter your ID..."
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="hover-pop w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--muted)] font-mono focus:border-[#60A5FA]/60"
              autoFocus
            />
            {isAdmin && (
              <p className="text-[9px] text-[#FFC53D] font-mono mt-1">Admin access detected</p>
            )}
          </div>

          {(isAdmin || needsPassword) && (
            <div>
              <label className="mb-1 block font-mono text-[10px]  tracking-wider text-[var(--text-secondary)]">Admin Password</label>
              <input
                type="password"
                required
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="hover-pop w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--muted)] font-mono focus:border-[#60A5FA]/60"
              />
            </div>
          )}

          {error && (
            <div className="bg-[#FF2E44]/10 border border-[#FF2E44]/30 text-[#FF8A8A] p-2.5 rounded-lg text-[10px] font-mono flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isAdmin && !needsPassword && (
            <button
              type="button"
              onClick={handleClientAccess}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#60A5FA] text-xs font-head font-bold text-[#05060B] py-2.5 shadow-[0_0_30px_-8px_rgba(96,165,250,0.9)] transition hover:bg-[#7FB3FF] cursor-pointer disabled:opacity-50"
            >
              <User className="w-4 h-4" />
              {loading ? "Verifying..." : "Access Client Dashboard"}
            </button>
          )}

          {(isAdmin || needsPassword) && (
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#60A5FA] text-xs font-head font-bold text-[#05060B] py-2.5 shadow-[0_0_30px_-8px_rgba(96,165,250,0.9)] transition hover:bg-[#7FB3FF] cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {loading ? "Authenticating..." : "Access Admin Dashboard"}
            </button>
          )}
        </form>

        <div className="text-center pt-2">
          <button type="button" onClick={() => window.location.href = "/"} className="text-[10px] font-mono text-[var(--muted)] hover:text-[var(--text-primary)] underline cursor-pointer flex items-center justify-center gap-1 mx-auto">
            Visit Public Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}