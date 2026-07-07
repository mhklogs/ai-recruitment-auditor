import React, { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, User, Lock, Globe } from "lucide-react";

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-red-900/5 pointer-events-none" />
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-5 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 to-red-600 rounded-t-2xl" />
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center bg-red-950/20 text-red-500 border border-red-500/20 p-2.5 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Access Portal</h3>
          <p className="text-xs text-[var(--text-secondary)]">Enter your Client ID or Admin credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">ID Number</label>
            <input
              type="text"
              required
              placeholder="Enter your ID..."
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] focus:border-[#be123c] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none font-mono"
              autoFocus
            />
            {isAdmin && (
              <p className="text-[9px] text-yellow-500 font-mono mt-1">Admin access detected</p>
            )}
          </div>

          {(isAdmin || needsPassword) && (
            <div>
              <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Admin Password</label>
              <input
                type="password"
                required
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] focus:border-[#be123c] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none font-mono"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-950/25 border border-red-800/30 text-red-400 p-2.5 rounded-lg text-[10px] font-mono flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isAdmin && !needsPassword && (
            <button
              type="button"
              onClick={handleClientAccess}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              {loading ? "Verifying..." : "Access Client Dashboard"}
            </button>
          )}

          {(isAdmin || needsPassword) && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading ? "Authenticating..." : "Access Admin Dashboard"}
            </button>
          )}
        </form>

        <div className="text-center pt-2">
          <button type="button" onClick={() => window.location.href = "/"} className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer flex items-center justify-center gap-1 mx-auto">
            <Globe className="w-3 h-3" />
            Visit Public Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
