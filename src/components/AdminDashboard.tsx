import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, Edit2, Trash2, X, Users, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  category: string;
  created_at: string;
  expires_at: string | null;
}

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", plan: "Starter", category: "Business", password: "", expiresAt: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClients(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const url = editingId ? `/api/admin/clients/${editingId}` : "/api/admin/register-client";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form } : form;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(editingId ? "Client updated." : "Client registered.");
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", email: "", company: "", plan: "Starter", category: "Business", password: "", expiresAt: "" });
      loadClients();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setForm({
      name: client.name,
      email: client.email,
      company: client.company,
      plan: client.plan,
      category: client.category,
      password: "",
      expiresAt: client.expires_at ? client.expires_at.slice(0, 16) : ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Client deleted.");
      loadClients();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", email: "", company: "", plan: "Starter", category: "Business", password: "", expiresAt: "" });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--bg-primary)] border border-red-500/40 p-2 rounded-lg text-red-500 shadow-md">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)]">ADMIN DASHBOARD</h1>
            <p className="text-xs text-[var(--text-secondary)]">Manage clients, subscriptions, and access</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-gray-500 text-[var(--text-primary)] px-3 py-1.5 rounded-lg cursor-pointer text-xs font-semibold">
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {error && (
          <div className="mb-4 bg-red-950/25 border border-red-800/30 text-red-400 p-3 rounded-lg text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            Registered Clients
          </h2>
          <button
            onClick={() => { cancelForm(); setShowForm(true); }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-900 to-red-600 text-white hover:opacity-90 text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Client
          </button>
        </div>

        {showForm && (
          <div className="mb-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold">{editingId ? "Edit Client" : "Register New Client"}</h3>
              <button onClick={cancelForm} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Full Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Company</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Plan</label>
                <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500">
                  <option value="Starter">Starter</option>
                  <option value="Growth">Growth</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500">
                  <option value="Business">Business</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Startup">Startup</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">{editingId ? "New Password (leave blank to keep)" : "Password"}</label>
                <input required={!editingId} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Expires At</label>
                <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer hover:opacity-90">
                  {editingId ? "Update Client" : "Register Client"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center text-xs text-[var(--text-secondary)] font-mono py-12">Loading clients...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <div key={client.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:border-gray-600 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{client.name}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-mono">{client.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(client)} className="p-1.5 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-blue-500 text-blue-400 cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="p-1.5 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-red-500 text-red-400 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 text-[10px] font-mono text-[var(--text-secondary)]">
                  <div className="flex justify-between"><span>ID:</span><span className="text-[var(--text-primary)] font-bold">{client.id}</span></div>
                  <div className="flex justify-between"><span>Company:</span><span className="text-[var(--text-primary)]">{client.company || "N/A"}</span></div>
                  <div className="flex justify-between"><span>Plan:</span><span className="text-[var(--text-primary)]">{client.plan}</span></div>
                  <div className="flex justify-between"><span>Category:</span><span className="text-[var(--text-primary)]">{client.category}</span></div>
                  <div className="flex justify-between"><span>Expires:</span><span className="text-[var(--text-primary)]">{client.expires_at ? new Date(client.expires_at).toLocaleDateString() : "N/A"}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
