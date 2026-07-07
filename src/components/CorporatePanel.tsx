import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Layers, 
  Users, 
  Cpu, 
  Mail, 
  Star, 
  CheckCircle, 
  Settings, 
  Sliders, 
  Save, 
  Sparkles,
  TrendingUp
} from "lucide-react";

export default function CorporatePanel() {
  // B2B Config State
  const [companyId, setCompanyId] = useState("client-techcorp");
  const [companyName, setCompanyName] = useState("TechCorp Solutions");
  const [role, setRole] = useState("Senior React Developer");
  const [seniority, setSeniority] = useState("Senior");
  
  // Custom Sliders
  const [maxResumes, setMaxResumes] = useState(250);
  const [maxTracks, setMaxTracks] = useState(5);
  const [activePreset, setActivePreset] = useState<string>("custom");

  // Telemetry Feedback Inquiry Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [inquiries, setInquiries] = useState<any[]>([
    {
      timestamp: "2026-07-07 14:23",
      name: "Arthur Dent",
      company: "Megadodo Publications",
      email: "arthur@guide.galaxy",
      message: "We need to scale our recruitment verification for junior galactic field reporters."
    }
  ]);
  const [submittedInquiry, setSubmittedInquiry] = useState(false);

  // Integrity Check State
  const [integrityData, setIntegrityData] = useState<any>({ healthy: true, scanTime: "", issuesCount: 0, issues: [] });
  const [integrityLoading, setIntegrityLoading] = useState(false);

  // Database Archival State
  const [dbData, setDbData] = useState<any>({ companyId: "client-techcorp", historicalRecords: [] });
  const [dbLoading, setDbLoading] = useState(false);

  // Load from API on mount
  useEffect(() => {
    fetchConfig();
    fetchIntegrity();
    fetchDatabase();
  }, []);

  const fetchDatabase = async () => {
    setDbLoading(true);
    try {
      const res = await fetch(`/api/vault-database/${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setDbData(data);
      }
    } catch (e) {
      console.error("Failed to load vault database ledger", e);
    } finally {
      setDbLoading(false);
    }
  };

  const fetchIntegrity = async () => {
    setIntegrityLoading(true);
    try {
      const res = await fetch("/api/vault-integrity");
      if (res.ok) {
        const data = await res.json();
        setIntegrityData(data);
      }
    } catch (e) {
      console.error("Failed to load integrity log", e);
    } finally {
      setIntegrityLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch(`/api/vault-config/${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setCompanyName(data.companyName || "TechCorp Solutions");
        setRole(data.role || "Senior React Developer");
        setSeniority(data.seniority || "Senior");
        if (data.subscription) {
          setMaxResumes(data.subscription.maxResumes || 250);
          setMaxTracks(data.subscription.maxTracks || 5);
          if (data.subscription.planName) {
            setActivePreset(data.subscription.planName);
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch config from server, using default states.");
    }
  };

  // Presets mapping
  const presets: Record<string, { price: number; resumes: number; tracks: number }> = {
    "Starter Tier": { price: 99, resumes: 50, tracks: 2 },
    "Professional Tier": { price: 299, resumes: 500, tracks: 10 },
    "Enterprise Tier": { price: 899, resumes: 2000, tracks: 40 }
  };

  const handlePresetSelect = (name: string) => {
    setActivePreset(name);
    if (presets[name]) {
      setMaxResumes(presets[name].resumes);
      setMaxTracks(presets[name].tracks);
    }
  };

  // Live price calculation for custom plan
  const computedPrice = activePreset === "custom" 
    ? Math.round((maxResumes * 0.40) + (maxTracks * 12.00)) 
    : (presets[activePreset]?.price || 99);

  const handleSaveConfig = async () => {
    try {
      const response = await fetch("/api/vault-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          companyName,
          role,
          seniority,
          jobContext: {
            roleRequirements: `Verification pipeline configured for ${role} hiring. Stack matching enabled.`,
            coreTechStack: "React, TypeScript, Tailwind"
          },
          subscription: {
            planName: activePreset,
            priceMonthly: computedPrice,
            maxResumes,
            maxTracks
          }
        })
      });

      if (!response.ok) throw new Error("Failed to save config");
      alert(`Successfully saved plan configurations for "${companyId}" back to config.json!`);
    } catch (err: any) {
      alert("Error saving corporate plan: " + err.message);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    const newInquiry = {
      timestamp: new Date().toISOString().replace('T', ' ').substr(0, 16),
      name: contactName,
      company: contactCompany || "Independent",
      email: contactEmail,
      message: contactMessage
    };

    setInquiries([newInquiry, ...inquiries]);
    setContactName("");
    setContactEmail("");
    setContactCompany("");
    setContactMessage("");
    setSubmittedInquiry(true);
    setTimeout(() => setSubmittedInquiry(false), 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-card)] text-[var(--text-primary)]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--border-color)] pb-5 gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
            <Shield className="w-5 h-5 text-red-500" />
            Corporate Layer & subscription System
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
            Onboard B2B corporate profiles, edit subscription plans, configure workspace capacities, and view lead telemetry.
          </p>
        </div>
        <button
          onClick={handleSaveConfig}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-900 to-red-600 text-white hover:opacity-90 text-[var(--text-primary)] text-xs font-semibold py-2.5 px-4 rounded-lg transition-all shadow-lg shadow-purple-900/20 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          Save Changes to config.json
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Identity & Settings (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Identity & Org Profile Section */}
          <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-2.5">
              <Users className="w-4 h-4 text-blue-400" />
              Corporate Profile Identity
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-[var(--text-secondary)] font-semibold mb-1 uppercase font-mono">Company ID (Vault Path)</label>
                <input
                  type="text"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-blue-500 text-gray-200 text-xs px-3 py-2 rounded-lg outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[var(--text-secondary)] font-semibold mb-1 uppercase font-mono">Corporate Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-blue-500 text-gray-200 text-xs px-3 py-2 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[var(--text-secondary)] font-semibold mb-1 uppercase font-mono">Target Job Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-blue-500 text-gray-200 text-xs px-3 py-2 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[var(--text-secondary)] font-semibold mb-1 uppercase font-mono">Target Seniority Level</label>
                <input
                  type="text"
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-blue-500 text-gray-200 text-xs px-3 py-2 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* Org Structure Grid */}
            <div className="pt-3">
              <label className="block text-[10px] text-[var(--text-secondary)] font-semibold mb-2 uppercase font-mono">Workspace Personnel & System Nodes</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] rounded-lg p-2.5 text-center">
                  <div className="text-[10px] text-[var(--text-secondary)] font-mono">Founder</div>
                  <div className="text-xs font-bold text-[var(--text-primary)] mt-1">Haze</div>
                  <div className="text-[9px] text-green-400 mt-0.5">● Owner</div>
                </div>
                <div className="bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] rounded-lg p-2.5 text-center">
                  <div className="text-[10px] text-[var(--text-secondary)] font-mono">Co-Founder</div>
                  <div className="text-xs font-bold text-[var(--text-primary)] mt-1">RecruitAI Core</div>
                  <div className="text-[9px] text-red-500 mt-0.5">● Co-Pilot</div>
                </div>
                <div className="bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] rounded-lg p-2.5 text-center">
                  <div className="text-[10px] text-[var(--text-secondary)] font-mono">Project Handler</div>
                  <div className="text-xs font-bold text-[var(--text-primary)] mt-1">Talent Ops SRE</div>
                  <div className="text-[9px] text-blue-400 mt-0.5">● Active</div>
                </div>
                <div className="bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] rounded-lg p-2.5 text-center">
                  <div className="text-[10px] text-[var(--text-secondary)] font-mono">AI Driver Cluster</div>
                  <div className="text-xs font-bold text-[var(--text-primary)] mt-1">4 Parallel Core</div>
                  <div className="text-[9px] text-[#8a3ffc] mt-0.5">⚡ High Cap</div>
                </div>
              </div>
            </div>
          </div>

          {/* Preset plans & Custom Plan Selector */}
          <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-2.5">
              <Layers className="w-4 h-4 text-red-500" />
              Dynamic Subscriptions & Custom Capacity
            </h2>

            {/* Presets Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(presets).map(([name, data]) => (
                <button
                  key={name}
                  onClick={() => handlePresetSelect(name)}
                  className={`border text-left p-3.5 rounded-lg transition-all relative overflow-hidden cursor-pointer ${
                    activePreset === name 
                      ? "border-purple-500 bg-purple-950/10 shadow-lg shadow-purple-900/5" 
                      : "border-[var(--border-color)] bg-[var(--bg-card)] hover:border-gray-600"
                  }`}
                >
                  {activePreset === name && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-[8px] font-bold text-[var(--text-primary)] px-1.5 py-0.5 rounded-bl">
                      ACTIVE
                    </div>
                  )}
                  <div className="text-xs font-bold text-[var(--text-primary)]">{name}</div>
                  <div className="text-lg font-bold text-red-500 mt-1">${data.price}<span className="text-[10px] text-[var(--text-secondary)] font-normal">/mo</span></div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-2 space-y-1">
                    <div>🗂️ {data.resumes} Resumes/mo</div>
                    <div>🎯 {data.tracks} Active Tracks</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Toggle Custom Selector */}
            <div className="border-t border-[var(--border-color)] pt-3.5">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setActivePreset("custom")}
                  className={`flex items-center gap-1.5 text-xs font-bold ${
                    activePreset === "custom" ? "text-red-500" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  } cursor-pointer`}
                >
                  <Sliders className="w-4 h-4" />
                  Customize Active Plan Capacity (Interactive Selector)
                </button>
                {activePreset === "custom" && (
                  <span className="text-[10px] bg-purple-950 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full font-mono">
                    Estimated Price: ${computedPrice}/mo
                  </span>
                )}
              </div>

              {activePreset === "custom" && (
                <div className="space-y-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4 transition-all">
                  <div>
                    <div className="flex justify-between text-[11px] text-[var(--text-primary)] mb-1">
                      <span>Max Resume Parsing Volume (Monthly limit)</span>
                      <span className="font-bold text-red-500">{maxResumes} Resumes</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={maxResumes}
                      onChange={(e) => setMaxResumes(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[9px] text-[var(--text-secondary)] mt-1 font-mono">
                      <span>10 Resumes</span>
                      <span>1,000 Resumes</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-[var(--text-primary)] mb-1">
                      <span>Concurrent Active Job Test Tracks</span>
                      <span className="font-bold text-red-500">{maxTracks} Job Tracks</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={maxTracks}
                      onChange={(e) => setMaxTracks(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[9px] text-[var(--text-secondary)] mt-1 font-mono">
                      <span>1 Track</span>
                      <span>20 Tracks</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Telemetry Contact & Customer Reviews (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Inbound Lead-Gen Telemetry Form */}
          <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-2.5">
              <Mail className="w-4 h-4 text-blue-400" />
              B2B Lead Acquisition (Contact Us)
            </h2>

            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-blue-500 text-gray-200 text-xs px-3 py-2 rounded-lg outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  placeholder="Business Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-blue-500 text-gray-200 text-xs px-3 py-2 rounded-lg outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={contactCompany}
                  onChange={(e) => setContactCompany(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-blue-500 text-gray-200 text-xs px-3 py-2 rounded-lg outline-none"
                />
              </div>
              <div>
                <textarea
                  placeholder="Inquiry or message details..."
                  rows={2}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-blue-500 text-gray-200 text-xs px-3 py-2 rounded-lg outline-none resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-[var(--text-primary)] text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Submit Lead Telemetry Inquiry
              </button>
            </form>

            {submittedInquiry && (
              <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-950/20 border border-green-800/30 p-2 rounded-lg font-mono">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Inquiry payload generated and saved.
              </div>
            )}

            {/* Inquiries Log */}
            <div className="border-t border-[var(--border-color)] pt-3">
              <label className="block text-[10px] text-[var(--text-secondary)] font-semibold mb-2 uppercase font-mono">Lead Inquiries Received ({inquiries.length})</label>
              <div className="max-h-[110px] overflow-y-auto space-y-2 pr-1 font-mono text-[10px]">
                {inquiries.map((iq, i) => (
                  <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-lg space-y-1">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>{iq.name} ({iq.company})</span>
                      <span>{iq.timestamp}</span>
                    </div>
                    <div className="text-[var(--text-primary)] italic">"{iq.message}"</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Satisfaction Reviews */}
          <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-2.5">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              Client Feedback Metadata (Public Reviews)
            </h2>

            <div className="space-y-3">
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">Genesis Logistics Group</span>
                  <div className="flex text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] italic">
                  "Parsing 1,500 candidate resumes for our dispatch batch was done in less than 5 minutes. The demographic anonymization guarantees meritocracy."
                </p>
                <div className="text-[9px] text-[var(--text-secondary)] font-mono">- HR Director, Genesis Group</div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">Quantum Analytics Inc</span>
                  <div className="flex text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] italic">
                  "The 4-hour delay lock gives our technical panel ample time to analyze audit reports before auto-releasing the candidate result cards."
                </p>
                <div className="text-[9px] text-[var(--text-secondary)] font-mono">- VP of Technology, Quantum Analytics</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SHARED PATH MONITOR & INTEGRITY VALIDATOR WIDGET */}
      <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-2.5 gap-2">
          <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            Shared Path Monitor & Integrity Lock Validator
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--text-secondary)] font-mono">Last scanned: {integrityData.scanTime || "Never"}</span>
            <button
              onClick={fetchIntegrity}
              disabled={integrityLoading}
              className="bg-[var(--border-color)] border border-[var(--border-color)] hover:border-gray-500 text-gray-200 text-[10px] font-semibold py-1 px-2.5 rounded transition-all cursor-pointer disabled:opacity-50"
            >
              {integrityLoading ? "Auditing locks..." : "Re-run System Integrity Scan"}
            </button>
          </div>
        </div>

        {/* Health status block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono block">CONCURRENT EXECUTION LOCKS</span>
              <span className="text-xs font-bold text-green-400 mt-1 block">Active & Race-Free</span>
            </div>
            <div className="bg-green-500/10 text-green-400 p-2 rounded">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono block">MONITORED CLASSIFICATION SYSTEMS</span>
              <span className="text-xs font-semibold text-[var(--text-primary)] mt-1 block">RecruiterCore & VibeAudit</span>
            </div>
            <div className="bg-blue-500/10 text-blue-400 p-2 rounded">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono block">SYSTEM INTEGRITY STATUS</span>
              <span className={`text-xs font-bold mt-1 block ${integrityData.healthy ? "text-green-400" : "text-yellow-400"}`}>
                {integrityData.healthy ? "HEALTHY (0 Sync Issues)" : `${integrityData.issuesCount} Issues Flagged`}
              </span>
            </div>
            <div className={`p-2 rounded ${integrityData.healthy ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Log contentions/errors list */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-3">
          <div className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase font-mono mb-2">Integrity Audit Error Log</div>
          {integrityData.issues && integrityData.issues.length > 0 ? (
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
              {integrityData.issues.map((issue: any, index: number) => (
                <div key={index} className="border-l-2 border-red-500 bg-red-950/10 p-2 rounded-r-lg flex items-start gap-2 text-xs font-mono">
                  <span className="text-red-400 font-bold">[{issue.level}]</span>
                  <div className="space-y-0.5">
                    <div className="text-gray-200 font-semibold">{issue.message}</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">
                      Company: {issue.companyId} | Candidate: {issue.candidate} {issue.file ? `| File: ${issue.file}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[var(--text-secondary)] text-xs font-mono italic py-2">
              No write contentions, file-locking overlaps, or sync errors detected in candidates directory. Concurrency parameters are stable.
            </div>
          )}
        </div>
      </div>

      {/* permanent database record archival ledger */}
      <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-2.5 gap-2">
          <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            Permanent Database Record Archival & Ledger ({dbData.historicalRecords?.length || 0} Records)
          </h2>
          <button
            onClick={fetchDatabase}
            disabled={dbLoading}
            className="bg-[var(--border-color)] border border-[var(--border-color)] hover:border-gray-500 text-gray-200 text-[10px] font-semibold py-1 px-2.5 rounded transition-all cursor-pointer disabled:opacity-50 font-mono"
          >
            {dbLoading ? "Accessing DB..." : "Refresh Database Index Ledger"}
          </button>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-3">
          {dbData.historicalRecords && dbData.historicalRecords.length > 0 ? (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {dbData.historicalRecords.map((rec: any, idx: number) => (
                <div key={idx} className="bg-[var(--bg-card-hover)]/50 border border-[var(--border-color)] p-3 rounded-lg flex flex-col md:flex-row justify-between gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">{rec.rollNumber}</span>
                      <span className="text-[var(--text-secondary)] text-[10px]">•</span>
                      <span className="text-[var(--text-primary)] font-semibold">{rec.candidateId}</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)]">
                      Email: {rec.email} | Merit Score: <span className="text-purple-300 font-bold">{rec.meritScore}%</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)] italic mt-1 line-clamp-1">
                      Justification: {rec.evaluation?.auditReport?.hiring_recommendation?.justification || rec.justification}
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col justify-between items-end text-right text-[10px] text-[var(--text-secondary)] gap-1.5 border-t md:border-t-0 border-[var(--border-color)] pt-2 md:pt-0">
                    <div>
                      <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-bold">
                        ARCHIVED
                      </span>
                    </div>
                    <div>Archived: {new Date(rec.archivedAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[var(--text-secondary)] text-xs font-mono italic py-4 text-center">
              No permanently archived evaluations indexed for B2B Client "{companyId}" yet.<br />
              <span className="text-[10px] text-gray-600 block mt-1">Completing candidate test submissions in the testing portal will compile evaluations and auto-archive records.</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
