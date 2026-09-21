import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, XCircle, Clock, TrendingUp, FileText, Users, AlertTriangle, ChevronDown, X } from "lucide-react";
import { RecruitAuditorWordmark } from "./Logo";

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

  // Custom plan proposal states
  const [showCustomPlanForm, setShowCustomPlanForm] = useState(false);
  const [customResumes, setCustomResumes] = useState(500);
  const [customTracks, setCustomTracks] = useState(10);

  const proposeCustomPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const detailsStr = `Proposed Custom Plan: ${customResumes} Resumes Limit, ${customTracks} Candidate tracks. Estimated Cost: $${Math.round((customResumes * 0.8) + (customTracks * 35))}/mo.`;
      const res = await fetch("/api/client/requests", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          clientId, 
          type: "Custom Plan Proposal", 
          details: JSON.stringify({ maxResumes: customResumes, maxTracks: customTracks, description: detailsStr })
        }) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Custom plan proposal submitted to administrator.");
      setShowCustomPlanForm(false);
      loadDashboard();
    } catch (err: any) { setError(err.message); }
  };

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
          <RecruitAuditorWordmark size={34} light />
          <div>
            <h1 className="font-display text-sm font-bold  tracking-[0.14em] text-[var(--text-primary)]">Client Dashboard</h1>
            <p className="text-xs font-mono text-[var(--muted)]">Welcome, {clientName}</p>
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
            <div className="text-[10px] font-mono text-[var(--text-secondary)] ">Total Requests</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.totalRequests}</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] ">Pending</div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">{stats.pendingRequests}</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] ">Hirings</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.totalHirings}</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] ">Success Ratio</div>
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
                
                <button 
                  type="button"
                  onClick={() => setShowCustomPlanForm(true)}
                  className="mt-3 w-full bg-red-600/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[10px] font-bold font-mono py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                >
                  Propose Custom Plan
                </button>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-secondary)]">No active subscription.</p>
            )}
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Success Ratio</h3>
            <div className="space-y-2">
              <div className="w-full bg-[var(--bg-card-hover)] rounded-full h-4 border border-[var(--border-color)]">
                <div className={`h-4 rounded-full bg-audit transition-all duration-500`} style={{ width: `${barWidth}%` }} />
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
              <button type="submit" className="w-full bg-audit text-white text-xs font-bold py-2 rounded-lg cursor-pointer">Submit Request</button>
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
              <button type="submit" className="w-full bg-audit text-white text-xs font-bold py-2 rounded-lg cursor-pointer">Add Hiring</button>
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

      {showCustomPlanForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-audit" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono">Propose Custom Plan</h4>
                <p className="text-[10px] text-[var(--text-secondary)] font-mono">Select custom parsing limit and active proctoring tracks.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomPlanForm(false)}
                className="text-gray-400 hover:text-ink cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={proposeCustomPlan} className="space-y-6">
              <div>
                <div className="flex justify-between text-xs text-[var(--text-primary)] mb-1">
                  <span>Monthly Resumes</span>
                  <span className="font-bold text-red-500">{customResumes} Resumes</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={customResumes}
                  onChange={(e) => setCustomResumes(Number(e.target.value))}
                  className="w-full cursor-pointer h-1.5 bg-[var(--border-color)] rounded-lg appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--text-primary)] mb-1">
                  <span>Candidate Tracks</span>
                  <span className="font-bold text-red-500">{customTracks} Tracks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={customTracks}
                  onChange={(e) => setCustomTracks(Number(e.target.value))}
                  className="w-full cursor-pointer h-1.5 bg-[var(--border-color)] rounded-lg appearance-none"
                />
              </div>

              <div className="text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg flex justify-between">
                <span>Estimated Monthly Cost:</span>
                <span className="font-bold text-[var(--text-primary)]">${Math.round((customResumes * 0.8) + (customTracks * 35))}/mo</span>
              </div>

              <button
                type="submit"
                className="w-full bg-audit text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer hover:opacity-95"
              >
                Submit Proposal to Admin
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
