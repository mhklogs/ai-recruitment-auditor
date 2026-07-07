import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, Trash2, CheckCircle2, XCircle, Clock, TrendingUp, FileText, Users, AlertTriangle, ChevronDown } from "lucide-react";

interface Request {
  id: string;
  type: string;
  status: string;
  details: string;
  created_at: string;
}

interface Hiring {
  id: string;
  candidate_name: string;
  role: string;
  status: string;
  created_at: string;
}

interface Subscription {
  plan: string;
  category: string;
  expires_at: string;
}

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  totalHirings: number;
  successfulHirings: number;
  successRatio: number;
  daysLeft: number;
  subscription: Subscription | null;
}

interface ClientDashboardProps {
  clientId: string;
  clientName: string;
  onLogout: () => void;
}

export default function ClientDashboard({ clientId, clientName, onLogout }: ClientDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({ totalRequests: 0, pendingRequests: 0, totalHirings: 0, successfulHirings: 0, successRatio: 0, daysLeft: 0, subscription: null });
  const [requests, setRequests] = useState<Request[]>([]);
  const [hirings, setHirings] = useState<Hiring[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReqForm, setShowReqForm] = useState(false);
  const [showHireForm, setShowHireForm] = useState(false);
  const [reqForm, setReqForm] = useState({ type: "Screening", details: "" });
  const [hireForm, setHireForm] = useState({ candidateName: "", role: "", status: "Pending" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/client/dashboard?clientId=${encodeURIComponent(clientId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStats(data.stats);
      setRequests(data.requests);
      setHirings(data.hirings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, [clientId]);

  const addRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/client/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId, ...reqForm }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Request added.");
      setShowReqForm(false);
      setReqForm({ type: "Screening", details: "" });
      loadDashboard();
    } catch (err: any) { setError(err.message); }
  };

  const addHiring = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/client/hirings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId, ...hireForm }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Hiring added.");
      setShowHireForm(false);
      setHireForm({ candidateName: "", role: "", status: "Pending" });
      loadDashboard();
    } catch (err: any) { setError(err.message); }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    try {
      const res = await fetch(`/api/client/requests/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      loadDashboard();
    } catch (err: any) { setError(err.message); }
  };

  const deleteHiring = async (id: string) => {
    if (!confirm("Delete this hiring record?")) return;
    try {
      const res = await fetch(`/api/client/hirings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      loadDashboard();
    } catch (err: any) { setError(err.message); }
  };

  const updateHiringStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/client/hirings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      loadDashboard();
    } catch (err: any) { setError(err.message); }
  };

  const successColor = stats.successRatio >= 70 ? "text-green-400" : stats.successRatio >= 40 ? "text-yellow-400" : "text-red-400";
  const barWidth = Math.min(100, stats.successRatio);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--bg-primary)] border border-red-500/40 p-2 rounded-lg text-red-500 shadow-md">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)]">CLIENT DASHBOARD</h1>
            <p className="text-xs text-[var(--text-secondary)]">Welcome, {clientName}</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-gray-500 text-[var(--text-primary)] px-3 py-1.5 rounded-lg cursor-pointer text-xs font-semibold">
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-950/25 border border-red-800/30 text-red-400 p-3 rounded-lg text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Total Requests</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.totalRequests}</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Pending</div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">{stats.pendingRequests}</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Hirings</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.totalHirings}</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Success Ratio</div>
            <div className={`text-2xl font-bold mt-1 ${successColor}`}>{stats.successRatio}%</div>
          </div>
        </div>

        {/* Subscription & Success Graph */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> Subscription Status</h3>
            {stats.subscription ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-[var(--text-secondary)]">Plan</span><span className="font-bold text-[var(--text-primary)]">{stats.subscription.plan}</span></div>
                <div className="flex justify-between text-xs"><span className="text-[var(--text-secondary)]">Category</span><span className="font-bold text-[var(--text-primary)]">{stats.subscription.category}</span></div>
                <div className="flex justify-between text-xs"><span className="text-[var(--text-secondary)]">Expires</span><span className="font-bold text-[var(--text-primary)]">{new Date(stats.subscription.expires_at).toLocaleDateString()}</span></div>
                <div className="flex justify-between text-xs"><span className="text-[var(--text-secondary)]">Days Left</span><span className={`font-bold ${stats.daysLeft <= 7 ? "text-red-400" : "text-green-400"}`}>{stats.daysLeft} days</span></div>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-secondary)]">No active subscription.</p>
            )}
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Success Ratio</h3>
            <div className="space-y-2">
              <div className="w-full bg-[var(--bg-card-hover)] rounded-full h-4 border border-[var(--border-color)]">
                <div className={`h-4 rounded-full bg-gradient-to-r from-blue-900 to-red-600 transition-all duration-500`} style={{ width: `${barWidth}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                <span>0%</span>
                <span className={`font-bold ${successColor}`}>{stats.successRatio}%</span>
                <span>100%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] font-mono">
                <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> Success: {stats.successfulHirings}</div>
                <div className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400" /> Total: {stats.totalHirings}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Requests */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-red-500" /> Requests</h3>
            <button onClick={() => setShowReqForm(!showReqForm)} className="flex items-center gap-1 bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-gray-500 text-[var(--text-primary)] text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> New Request
            </button>
          </div>
          {showReqForm && (
            <form onSubmit={addRequest} className="mb-4 p-4 bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border-color)] space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select value={reqForm.type} onChange={(e) => setReqForm({ ...reqForm, type: e.target.value })} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none">
                  <option value="Screening">Screening</option>
                  <option value="Audit">Audit</option>
                  <option value="Support">Support</option>
                  <option value="Other">Other</option>
                </select>
                <input required placeholder="Details" value={reqForm.details} onChange={(e) => setReqForm({ ...reqForm, details: e.target.value })} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-2 rounded-lg cursor-pointer">Submit Request</button>
            </form>
          )}
          <div className="space-y-2">
            {requests.length === 0 && <p className="text-xs text-[var(--text-secondary)] text-center py-4">No requests yet.</p>}
            {requests.map((r) => (
              <div key={r.id} className="flex justify-between items-center p-3 bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border-color)]">
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">{r.type}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">{r.details}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${r.status === "Pending" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"}`}>{r.status}</span>
                  <button onClick={() => deleteRequest(r.id)} className="p-1 rounded hover:bg-red-500/10 text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hirings */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2"><Users className="w-4 h-4 text-green-500" /> Hirings</h3>
            <button onClick={() => setShowHireForm(!showHireForm)} className="flex items-center gap-1 bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-gray-500 text-[var(--text-primary)] text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> New Hiring
            </button>
          </div>
          {showHireForm && (
            <form onSubmit={addHiring} className="mb-4 p-4 bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border-color)] space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input required placeholder="Candidate Name" value={hireForm.candidateName} onChange={(e) => setHireForm({ ...hireForm, candidateName: e.target.value })} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none" />
                <input required placeholder="Role" value={hireForm.role} onChange={(e) => setHireForm({ ...hireForm, role: e.target.value })} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none" />
                <select value={hireForm.status} onChange={(e) => setHireForm({ ...hireForm, status: e.target.value })} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none">
                  <option value="Pending">Pending</option>
                  <option value="Hired">Hired</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-2 rounded-lg cursor-pointer">Add Hiring</button>
            </form>
          )}
          <div className="space-y-2">
            {hirings.length === 0 && <p className="text-xs text-[var(--text-secondary)] text-center py-4">No hirings yet.</p>}
            {hirings.map((h) => (
              <div key={h.id} className="flex justify-between items-center p-3 bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border-color)]">
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">{h.candidate_name} <span className="text-[var(--text-secondary)] font-normal">- {h.role}</span></div>
                  <div className="text-[10px] text-[var(--text-secondary)]">{new Date(h.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={h.status} onChange={(e) => updateHiringStatus(h.id, e.target.value)} className="text-[10px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] px-2 py-1 rounded cursor-pointer">
                    <option value="Pending">Pending</option>
                    <option value="Hired">Hired</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button onClick={() => deleteHiring(h.id)} className="p-1 rounded hover:bg-red-500/10 text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
