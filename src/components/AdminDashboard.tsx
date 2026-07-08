import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, Edit2, Trash2, X, Users, CheckCircle2, XCircle, Clock, AlertTriangle, Send, Cpu, FileText, Eye, BarChart3, Loader2 } from "lucide-react";

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

interface Test {
  id: string;
  title: string;
  description: string;
  candidate_email: string;
  candidate_name: string;
  duration_min: number;
  status: string;
  created_at: string;
}

interface Question {
  id: string;
  test_id: string;
  type: string;
  question_text: string;
  options: string[] | null;
  correct_answer: string | null;
  points: number;
  order_index: number;
}

interface TestResult {
  id: string;
  candidate_name: string;
  candidate_email: string;
  score: number;
  total_points: number;
  status: string;
  submitted_at: string;
  answers: any;
}

type Tab = "clients" | "create-test" | "tests" | "results" | "leads";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("clients");
  const [clients, setClients] = useState<Client[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clientForm, setClientForm] = useState({ name: "", email: "", company: "", plan: "Starter", category: "Business", password: "", expiresAt: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [b2bRequests, setB2bRequests] = useState<any[]>([]);

  // Create test form state
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [testCandidateEmail, setTestCandidateEmail] = useState("");
  const [testCandidateName, setTestCandidateName] = useState("");
  const [testDuration, setTestDuration] = useState("60");
  const [testCompanyId, setTestCompanyId] = useState("");
  const [testQuestionsList, setTestQuestionsList] = useState<any[]>([
    { type: "text", question_text: "", options: ["", "", "", ""], correct_answer: "", points: 1 }
  ]);
  const [testCreating, setTestCreating] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

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

  const loadTests = async () => {
    try {
      const res = await fetch("/api/admin/tests");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTests(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadTestDetails = async (testId: string) => {
    try {
      const [testRes, resultsRes] = await Promise.all([
        fetch(`/api/admin/tests/${testId}`),
        fetch(`/api/admin/tests/${testId}/results`)
      ]);
      const testData = await testRes.json();
      const resultsData = await resultsRes.json();
      if (!testRes.ok) throw new Error(testData.error);
      setSelectedTest(testData);
      setTestQuestions(testData.questions || []);
      setTestResults(resultsData || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLeads(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await fetch("/api/admin/requests");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setB2bRequests(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/approve-request/${requestId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("B2B Request approved successfully. Client plan updated.");
      loadRequests();
      loadClients();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => { loadClients(); loadRequests(); }, []);
  useEffect(() => { 
    if (activeTab === "tests") loadTests();
    if (activeTab === "leads") loadLeads();
    if (activeTab === "clients") { loadClients(); loadRequests(); }
  }, [activeTab]);

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const url = editingId ? `/api/admin/clients/${editingId}` : "/api/admin/register-client";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...clientForm } : clientForm;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(editingId ? "Client updated." : "Client registered.");
      setShowClientForm(false);
      setEditingId(null);
      setClientForm({ name: "", email: "", company: "", plan: "Starter", category: "Business", password: "", expiresAt: "" });
      loadClients();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingId(client.id);
    setClientForm({
      name: client.name,
      email: client.email,
      company: client.company,
      plan: client.plan,
      category: client.category,
      password: "",
      expiresAt: client.expires_at ? client.expires_at.slice(0, 16) : ""
    });
    setShowClientForm(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Delete this client?")) return;
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

  const addQuestion = () => {
    setTestQuestionsList([...testQuestionsList, { type: "text", question_text: "", options: ["", "", "", ""], correct_answer: "", points: 1 }]);
  };

  const removeQuestion = (index: number) => {
    setTestQuestionsList(testQuestionsList.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...testQuestionsList];
    updated[index] = { ...updated[index], [field]: value };
    setTestQuestionsList(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...testQuestionsList];
    updated[qIndex].options[oIndex] = value;
    setTestQuestionsList(updated);
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setTestCreating(true);
    setTestResult(null);
    try {
      const validQuestions = testQuestionsList.filter(q => q.question_text.trim() !== "");
      if (validQuestions.length === 0) throw new Error("Please add at least one question.");

      const res = await fetch("/api/admin/create-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: testTitle || "Technical Assessment",
          description: testDescription,
          candidateEmail: testCandidateEmail,
          candidateName: testCandidateName,
          durationMin: parseInt(testDuration),
          companyId: testCompanyId || "default",
          questions: validQuestions.map((q, idx) => ({
            type: q.type,
            question_text: q.question_text,
            options: q.type === "multiple_choice" ? q.options.filter((o: string) => o.trim() !== "") : null,
            correct_answer: q.correct_answer,
            points: q.points,
            order_index: idx
          }))
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Test created and invitation sent!");
      setTestResult(data);
      setTestTitle("");
      setTestDescription("");
      setTestCandidateEmail("");
      setTestCandidateName("");
      setTestDuration("60");
      setTestCompanyId("");
      setTestQuestionsList([{ type: "text", question_text: "", options: ["", "", "", ""], correct_answer: "", points: 1 }]);
      loadTests();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTestCreating(false);
    }
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
            <p className="text-xs text-[var(--text-secondary)]">Full system control center</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-gray-500 text-[var(--text-primary)] px-3 py-1.5 rounded-lg cursor-pointer text-xs font-semibold">
          Logout
        </button>
      </header>

      <div className="border-b border-[var(--border-color)] bg-[var(--bg-card)] px-6">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: "clients", label: "Clients", icon: Users },
            { id: "create-test", label: "Create Test", icon: Cpu },
            { id: "tests", label: "Tests", icon: FileText },
            { id: "results", label: "Results", icon: BarChart3 },
            { id: "leads", label: "Inbound Leads", icon: Send }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === tab.id ? "border-b-2 border-red-500 text-red-400" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

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

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5 text-red-500" /> Registered Clients</h2>
              <button onClick={() => { setEditingId(null); setClientForm({ name: "", email: "", company: "", plan: "Starter", category: "Business", password: "", expiresAt: "" }); setShowClientForm(true); }} className="flex items-center gap-1.5 bg-gradient-to-r from-blue-900 to-red-600 text-white hover:opacity-90 text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer shadow-md">
                <Plus className="w-4 h-4" /> New Client
              </button>
            </div>

            {/* B2B Client Requests & Proposals */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 mb-6">
              <div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">B2B Client Requests & Custom Plan Proposals</h3>
                <p className="text-[10px] text-[var(--text-secondary)]">Manage incoming configuration requests and plan updates from registered accounts.</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-gray-500 font-mono">
                      <th className="py-2 px-3">Client ID</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Details</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {b2bRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500 italic">No client requests found.</td>
                      </tr>
                    ) : (
                      b2bRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                          <td className="py-2 px-3 font-semibold font-mono text-[var(--text-primary)]">
                            {req.client_id}
                            {req.clients && (
                              <span className="block text-[8px] font-sans font-normal text-[var(--text-secondary)]">
                                {req.clients.name} ({req.clients.company})
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono">{req.type}</td>
                          <td className="py-2 px-3 max-w-sm truncate" title={req.details}>{req.details}</td>
                          <td className="py-2 px-3">
                            <span className={`text-[8px] font-bold font-mono px-2 py-0.5 rounded ${
                              req.status === "Approved" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            {req.status === "Pending" && (
                              <button
                                onClick={() => handleApproveRequest(req.id)}
                                className="bg-green-600 hover:bg-green-500 text-white text-[9px] font-bold font-mono py-1 px-2 rounded cursor-pointer transition-colors"
                              >
                                Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {showClientForm && (
              <div className="mb-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold">{editingId ? "Edit Client" : "Register New Client"}</h3>
                  <button onClick={() => { setShowClientForm(false); setEditingId(null); }} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleClientSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Full Name</label><input required value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" /></div>
                  <div><label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Email</label><input required type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" /></div>
                  <div><label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Company</label><input value={clientForm.company} onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" /></div>
                  <div>
                    <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Plan</label>
                    <input required value={clientForm.plan} onChange={(e) => setClientForm({ ...clientForm, plan: e.target.value })} placeholder="e.g. Starter, Growth, Enterprise, or Custom Plan" className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Category</label>
                    <select value={clientForm.category} onChange={(e) => setClientForm({ ...clientForm, category: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500">
                      <option value="Business">Business</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="Startup">Startup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">{editingId ? "New Password (leave blank to keep)" : "Password"}</label>
                    <input required={!editingId} type="password" value={clientForm.password} onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Expires At</label>
                    <input type="datetime-local" value={clientForm.expiresAt} onChange={(e) => setClientForm({ ...clientForm, expiresAt: e.target.value })} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
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
                        <button onClick={() => handleEditClient(client)} className="p-1.5 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-blue-500 text-blue-400 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteClient(client.id)} className="p-1.5 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-red-500 text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
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
          </div>
        )}

        {/* Create Test Tab */}
        {activeTab === "create-test" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2"><Cpu className="w-5 h-5 text-red-500" /> Create Assessment Test</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Build a full-fledged test with multiple questions, set duration, and send a secure proctored link to the candidate.</p>
            </div>

            <form onSubmit={handleCreateTest} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Test Title</label>
                  <input value={testTitle} onChange={(e) => setTestTitle(e.target.value)} placeholder="e.g. Senior Frontend Assessment" className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Duration (minutes)</label>
                  <input type="number" min="5" max="180" value={testDuration} onChange={(e) => setTestDuration(e.target.value)} className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Description / Instructions</label>
                <textarea rows={2} value={testDescription} onChange={(e) => setTestDescription(e.target.value)} placeholder="Brief description of the assessment..." className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500 resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Candidate Name</label>
                  <input required value={testCandidateName} onChange={(e) => setTestCandidateName(e.target.value)} placeholder="John Doe" className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Candidate Email</label>
                  <input required type="email" value={testCandidateEmail} onChange={(e) => setTestCandidateEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Company / Client ID (optional)</label>
                <input value={testCompanyId} onChange={(e) => setTestCompanyId(e.target.value)} placeholder="default" className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500" />
              </div>

              {/* Questions Builder */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold">Questions</h3>
                  <button type="button" onClick={addQuestion} className="flex items-center gap-1 bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-gray-500 text-[var(--text-primary)] text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {testQuestionsList.map((q, qIndex) => (
                  <div key={qIndex} className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-[var(--text-secondary)]">Question {qIndex + 1}</span>
                      <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-400 hover:text-red-300 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Type</label>
                        <select value={q.type} onChange={(e) => updateQuestion(qIndex, "type", e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none">
                          <option value="text">Text / Essay</option>
                          <option value="multiple_choice">Multiple Choice</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Points</label>
                        <input type="number" min="1" value={q.points} onChange={(e) => updateQuestion(qIndex, "points", parseInt(e.target.value) || 1)} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Correct Answer</label>
                        <input value={q.correct_answer} onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)} placeholder="For auto-grading" className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-[var(--text-secondary)] font-mono uppercase mb-1">Question Text</label>
                      <textarea required rows={2} value={q.question_text} onChange={(e) => updateQuestion(qIndex, "question_text", e.target.value)} placeholder="Enter your question..." className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none resize-none" />
                    </div>
                    {q.type === "multiple_choice" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(q.options || ["", "", "", ""]).map((opt, oIndex) => (
                          <input key={oIndex} value={opt} onChange={(e) => updateOption(qIndex, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button type="submit" disabled={testCreating} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer hover:opacity-90 disabled:opacity-50">
                {testCreating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Test...</> : <><Send className="w-4 h-4" /> Create Test & Send Invitation</>}
              </button>
            </form>

            {testResult && (
              <div className="mt-6 bg-[var(--bg-card)] border border-green-500/20 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Test Created Successfully</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Test Link:</span><span className="text-[var(--text-primary)] break-all">{testResult.testLink}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Email Sent:</span><span className={testResult.emailSent ? "text-green-400" : "text-red-400"}>{testResult.emailSent ? "Yes" : "No (mock mode)"}</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === "tests" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-red-500" /> All Tests</h2>
              <button onClick={loadTests} className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">Refresh</button>
            </div>
            {tests.length === 0 ? (
              <div className="text-center text-xs text-[var(--text-secondary)] font-mono py-12">No tests created yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tests.map((test) => (
                  <div key={test.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:border-gray-600 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">{test.title}</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] font-mono">{test.candidate_name} ({test.candidate_email})</p>
                      </div>
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${test.status === "TEST_SUBMITTED" ? "bg-green-500/10 text-green-400" : test.status === "TERMINATED_FRAUD" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>{test.status}</span>
                    </div>
                    <div className="space-y-1.5 text-[10px] font-mono text-[var(--text-secondary)]">
                      <div className="flex justify-between"><span>Duration:</span><span className="text-[var(--text-primary)]">{test.duration_min} min</span></div>
                      <div className="flex justify-between"><span>Created:</span><span className="text-[var(--text-primary)]">{new Date(test.created_at).toLocaleDateString()}</span></div>
                      <div className="flex justify-between"><span>Expires:</span><span className="text-[var(--text-primary)]">{new Date(test.expires_at).toLocaleDateString()}</span></div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => { setSelectedTest(test); loadTestDetails(test.id); setActiveTab("results"); }} className="flex items-center gap-1 bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-blue-500 text-blue-400 text-[10px] font-semibold py-1.5 px-3 rounded-lg cursor-pointer">
                        <Eye className="w-3 h-3" /> View Results
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2"><BarChart3 className="w-5 h-5 text-red-500" /> Test Results</h2>
              {selectedTest && (
                <button onClick={() => { setSelectedTest(null); setTestQuestions([]); setTestResults([]); }} className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">
                  Back to Tests
                </button>
              )}
            </div>

            {selectedTest ? (
              <div className="space-y-6">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
                  <h3 className="text-sm font-bold mb-2">{selectedTest.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">{selectedTest.description}</p>
                  <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                    Candidate: <span className="text-[var(--text-primary)]">{selectedTest.candidate_name}</span> | 
                    Duration: <span className="text-[var(--text-primary)]">{selectedTest.duration_min} min</span> |
                    Status: <span className="text-[var(--text-primary)]">{selectedTest.status}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-3">Questions ({testQuestions.length})</h4>
                  <div className="space-y-3">
                    {testQuestions.map((q, idx) => (
                      <div key={q.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-[var(--text-secondary)]">Q{idx + 1} ({q.points} pts)</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">{q.type}</span>
                        </div>
                        <p className="text-xs text-[var(--text-primary)] mb-2">{q.question_text}</p>
                        {q.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className={`text-[10px] font-mono p-2 rounded-lg border ${opt.toLowerCase() === (q.correct_answer || "").toLowerCase() ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-[var(--bg-card-hover)] border-[var(--border-color)] text-[var(--text-secondary)]"}`}>
                                {String.fromCharCode(65 + oIdx)}. {opt}
                                {opt.toLowerCase() === (q.correct_answer || "").toLowerCase() && " ✓"}
                              </div>
                            ))}
                          </div>
                        )}
                        {q.correct_answer && q.type !== "multiple_choice" && (
                          <div className="text-[10px] font-mono text-green-400 mt-1">Correct Answer: {q.correct_answer}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-3">Submissions ({testResults.length})</h4>
                  {testResults.length === 0 ? (
                    <div className="text-center text-xs text-[var(--text-secondary)] font-mono py-8">No submissions yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {testResults.map((result) => (
                        <div key={result.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="text-xs font-bold text-[var(--text-primary)]">{result.candidate_name}</h5>
                              <p className="text-[10px] text-[var(--text-secondary)] font-mono">{result.candidate_email}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-[var(--text-primary)]">{result.score}/{result.total_points}</div>
                              <div className="text-[10px] text-[var(--text-secondary)] font-mono">{Math.round((result.score / result.total_points) * 100)}%</div>
                            </div>
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-mono">
                            Status: {result.status} | Submitted: {result.submitted_at ? new Date(result.submitted_at).toLocaleString() : "N/A"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-[var(--text-secondary)] font-mono py-12">Select a test from the Tests tab to view results.</div>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2"><Send className="w-5 h-5 text-red-500" /> Inbound Leads</h2>
              <button 
                type="button"
                onClick={loadLeads}
                className="text-xs text-red-500 hover:text-red-400 font-semibold flex items-center gap-1 bg-red-500/5 px-2.5 py-1.5 rounded-lg border border-red-500/10 cursor-pointer"
              >
                Refresh Data
              </button>
            </div>

            {/* Contacts Table */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Contact Requests</h4>
                <p className="text-[10px] text-[var(--text-secondary)]">B2B demo inquiries submitted via the homepage contact form.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-gray-500 font-mono">
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Company</th>
                      <th className="py-2.5 px-3">Message</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {leads.filter(l => l.type === "contact").length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500 italic">No contact requests found.</td>
                      </tr>
                    ) : (
                      leads.filter(l => l.type === "contact").map((l, idx) => (
                        <tr key={idx} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">{l.name}</td>
                          <td className="py-2.5 px-3 font-mono">{l.email}</td>
                          <td className="py-2.5 px-3">{l.company}</td>
                          <td className="py-2.5 px-3 max-w-xs truncate text-[var(--text-secondary)]" title={l.message}>{l.message}</td>
                          <td className="py-2.5 px-3 font-mono text-gray-500">{new Date(l.timestamp).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Newsletter Subscriptions */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Newsletter Subscribers</h4>
                  <p className="text-[10px] text-[var(--text-secondary)]">Users subscribed to product updates.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] text-gray-500 font-mono">
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Subscribed At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {leads.filter(l => l.type === "newsletter").length === 0 ? (
                        <tr>
                          <td colSpan={2} className="py-4 text-center text-gray-500 italic">No subscribers found.</td>
                        </tr>
                      ) : (
                        leads.filter(l => l.type === "newsletter").map((l, idx) => (
                          <tr key={idx} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                            <td className="py-2.5 px-3 font-mono text-[var(--text-primary)]">{l.email}</td>
                            <td className="py-2.5 px-3 font-mono text-gray-500">{new Date(l.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Guide Downloads */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Whitepaper Downloads</h4>
                  <p className="text-[10px] text-[var(--text-secondary)]">Users who downloaded the AI Hiring Guide.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] text-gray-500 font-mono">
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Downloaded At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {leads.filter(l => l.type === "download").length === 0 ? (
                        <tr>
                          <td colSpan={2} className="py-4 text-center text-gray-500 italic">No downloads found.</td>
                        </tr>
                      ) : (
                        leads.filter(l => l.type === "download").map((l, idx) => (
                          <tr key={idx} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                            <td className="py-2.5 px-3 font-mono text-[var(--text-primary)]">{l.email}</td>
                            <td className="py-2.5 px-3 font-mono text-gray-500">{new Date(l.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
