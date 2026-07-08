import React, { useState } from "react";
import { 
  Terminal, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Code2, 
  Workflow, 
  Zap, 
  Globe, 
  ArrowRight, 
  CheckCircle,
  Briefcase,
  Layers,
  Send
} from "lucide-react";
import TeamSection from "./TeamSection";

export default function CareersLanding() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "software-engineer",
    github: "",
    portfolio: "",
    bio: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          github: formData.github,
          portfolio: formData.portfolio,
          bio: formData.bio
        })
      });
    } catch (err) {
      console.error("Failed to submit careers application:", err);
    }
    setFormSubmitted(true);
  };

  const techStack = [
    { name: "TypeScript", icon: Code2, desc: "Strong typing for audit engine scalability" },
    { name: "React 19", icon: Cpu, desc: "High-performance reactive user interfaces" },
    { name: "Node.js & Express", icon: Terminal, desc: "Robust API orchestration and streaming endpoints" },
    { name: "Supabase & Postgres", icon: Database, desc: "Secure state storage and row-level authorization" },
    { name: "Tailwind CSS v4", icon: Layers, desc: "Sleek, responsive styling paradigms" },
    { name: "Git & CI/CD", icon: Workflow, desc: "Automated pipelines and production branch guards" },
    { name: "Vite", icon: Zap, desc: "Lightning fast dev server bundling" },
    { name: "AI Orchestration", icon: ShieldCheck, desc: "Integration with LLM decision graphs and sandboxes" }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-x-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.06)_0%,rgba(30,58,138,0.04)_50%,transparent_100%)] pointer-events-none" />

      {/* Floating navigation header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border-color)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-mono font-bold tracking-wider text-xs md:text-sm uppercase text-[var(--text-primary)]">
            <span className="p-1.5 rounded-lg bg-red-600 text-white font-black"><Cpu className="w-4 h-4" /></span>
            RecruitAI <span className="text-red-500 font-normal">Engine</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            <a href="#culture" className="hover:text-[var(--text-primary)] transition-colors">Culture</a>
            <a href="#hiring" className="hover:text-[var(--text-primary)] transition-colors">Process</a>
            <a href="#team" className="hover:text-[var(--text-primary)] transition-colors">Team</a>
            <a href="#tech" className="hover:text-[var(--text-primary)] transition-colors">Stack</a>
          </nav>
          <div>
            <a 
              href="#apply" 
              className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-300"
            >
              Open Roles
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="py-24 md:py-32 px-6 text-center max-w-5xl mx-auto space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/5 border border-red-500/15">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase font-mono">Careers at RecruitAI</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-secondary)] text-transparent bg-clip-text">
          Help Us Solve the Hardest Engineering Problems in <span className="bg-gradient-to-r from-red-500 via-rose-500 to-blue-500 text-transparent bg-clip-text">AI Auditing</span>
        </h1>
        
        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
          We are building the trust layer for autonomous recruitment. Join a high-caliber team of engineers engineering secure, scalable, and bias-free candidate evaluation systems.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#apply"
            className="w-full sm:w-auto px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-950/20 flex items-center justify-center gap-2 transition-all duration-300 hover:translate-y-[-2px]"
          >
            Join the Mission <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#culture"
            className="w-full sm:w-auto px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-red-500/30 rounded-xl text-[var(--text-primary)] flex items-center justify-center gap-2 transition-all duration-300"
          >
            Our Philosophy
          </a>
        </div>
      </section>

      {/* CULTURE & PHILOSOPHY SECTION */}
      <section id="culture" className="py-24 px-6 border-t border-[var(--border-color)] relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">Culture & Philosophy</h2>
            <h3 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Our Core Operating Values</h3>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              We replace process overhead with absolute clarity and engineering autonomy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-2xl space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:shadow-[var(--glow-shadow)] group">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform duration-300">
                <Terminal className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Technical Rigor</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                We take pride in clean design systems, strict linting, TypeScript typing, and optimized backend query layouts. We measure and audit what we build.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-2xl space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-[var(--glow-shadow)] group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)]">AI-First Workflow</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                We co-program with agentic AI assistants daily, building systems that leverage models not just for autocomplete, but for sandbox orchestration and deep telemetry auditing.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-2xl space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/20 hover:shadow-[var(--glow-shadow)] group">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform duration-300">
                <Workflow className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Collaborative Autonomy</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                We work in small, highly aligned teams. You own your code end-to-end, meaning low meeting overhead, high direct project impact, and rapid release cadences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE HIRING PROCESS TIMELINE */}
      <section id="hiring" className="py-24 px-6 border-t border-[var(--border-color)] bg-[var(--bg-card)]/30 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">The Recruitment Path</h2>
            <h3 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Built on Candidate Trust</h3>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              We respect your time. Our hiring cycle is streamlined, transparent, and developer-centric.
            </p>
          </div>

          {/* Timeline Wrapper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-4 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-mono font-bold flex items-center justify-center text-xs">1</div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-red-600 to-slate-800 hidden lg:block" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono">Application</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Submit your GitHub profile, portfolio link, or CV. We review applications within 48 hours focusing on real, practical engineering output.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-mono font-bold flex items-center justify-center text-xs">2</div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-rose-600 to-slate-800 hidden lg:block" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono">Technical Assessment</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Solve a practical, real-world sandbox challenge matching our actual tech stack. No algorithmic trivia or whiteboard balancing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-mono font-bold flex items-center justify-center text-xs">3</div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-600 to-slate-800 hidden lg:block" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono">Team Sync</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Join a 45-minute architectural review with our technical founders. We discuss your solution, design patterns, and engineering philosophies.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs">4</div>
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono">Rapid Onboarding</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Receive an offer within 24 hours. Once joined, get direct production write-access on your first day with dedicated peer support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SPOTLIGHT SECTION */}
      <section className="border-t border-[var(--border-color)]">
        <TeamSection />
      </section>

      {/* TECHNICAL STACK / ENVIRONMENT SECTION */}
      <section id="tech" className="py-24 px-6 border-t border-[var(--border-color)] bg-[var(--bg-card)]/20 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">Engineering Stack</h2>
            <h3 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Our Production Environment</h3>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              We use modern, fast, and secure tools to ship stable software rapidly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {techStack.map((tech, idx) => (
              <div 
                key={idx} 
                className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/10 hover:shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-500/10 to-blue-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <tech.icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">{tech.name}</h4>
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE APPLICATION FORM */}
      <section id="apply" className="py-24 px-6 border-t border-[var(--border-color)] bg-[var(--bg-card)]/50 relative">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">Join the Mission</h2>
            <h3 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Launch Your Application</h3>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              Submit your credentials below. No formal cover letter required; let your work speak for itself.
            </p>
          </div>

          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-blue-500" />
            
            {formSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[var(--text-primary)]">Application Successfully Registered</h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                  Thank you for applying to RecruitAI! Our engineering team will review your credentials and get back to you via email within 48 hours.
                </p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-card-hover)] transition-all mt-4"
                >
                  Apply for another role
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] text-[var(--text-secondary)] font-mono font-bold uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Alan Turing"
                      className="w-full text-xs bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 focus:outline-none focus:border-red-500/50 hover:bg-[var(--bg-card-hover)] transition-all text-[var(--text-primary)] placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-[var(--text-secondary)] font-mono font-bold uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="alan@turing.org"
                      className="w-full text-xs bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 focus:outline-none focus:border-red-500/50 hover:bg-[var(--bg-card-hover)] transition-all text-[var(--text-primary)] placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] text-[var(--text-secondary)] font-mono font-bold uppercase tracking-wider mb-2">Target Role</label>
                    <select 
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full text-xs bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 focus:outline-none focus:border-red-500/50 hover:bg-[var(--bg-card-hover)] transition-all text-[var(--text-primary)] font-mono"
                    >
                      <option value="software-engineer">Software Engineer (Frontend/Core)</option>
                      <option value="systems-architect">Systems Architect (Sandbox Security)</option>
                      <option value="ai-scientist">R&D AI Security Scientist</option>
                      <option value="developer-relations">Developer Advocate / Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-[var(--text-secondary)] font-mono font-bold uppercase tracking-wider mb-2">GitHub Profile Link</label>
                    <input 
                      type="url" 
                      name="github"
                      required
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/turing"
                      className="w-full text-xs bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 focus:outline-none focus:border-red-500/50 hover:bg-[var(--bg-card-hover)] transition-all text-[var(--text-primary)] placeholder-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-[var(--text-secondary)] font-mono font-bold uppercase tracking-wider mb-2">Portfolio or Project Links (Optional)</label>
                  <input 
                    type="url" 
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://turing.org"
                    className="w-full text-xs bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 focus:outline-none focus:border-red-500/50 hover:bg-[var(--bg-card-hover)] transition-all text-[var(--text-primary)] placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-[var(--text-secondary)] font-mono font-bold uppercase tracking-wider mb-2">Brief Technical Accomplishments Summary</label>
                  <textarea 
                    name="bio"
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Briefly describe an auditing parser, sandbox virtualization, or high-performance frontend component you have deployed."
                    className="w-full text-xs bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 focus:outline-none focus:border-red-500/50 hover:bg-[var(--bg-card-hover)] transition-all text-[var(--text-primary)] placeholder-gray-600 resize-y"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg hover:shadow-red-900/30 flex items-center justify-center gap-2 transition-all duration-300 active:scale-98"
                >
                  <Send className="w-4 h-4" /> Submit Engineering Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-card)] text-center text-xs text-[var(--text-secondary)] font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RecruitAI Engine Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/" className="hover:text-[var(--text-primary)] transition-colors">Corporate Landing</a>
            <a href="/login" className="hover:text-[var(--text-primary)] transition-colors">Audit Console</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
