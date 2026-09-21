import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  Briefcase,
  Layers,
  Send
} from "lucide-react";
import TeamSection from "./TeamSection";
import { RecruitAuditorWordmark } from "./Logo";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.05 }
      );

      const elements = document.querySelectorAll(
        ".reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale, .reveal-down, .reveal-up"
      );
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-x-hidden font-sans">
      {/* Background scaffolds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hud-grid" />
        <div className="aurora -top-20 left-[6%] h-80 w-80 bg-[#60A5FA]/14" />
        <div className="aurora top-40 right-[5%] h-72 w-72 bg-[#4DE3FF]/8" />
        <div className="aurora bottom-[10%] left-1/2 h-64 w-[130%] -translate-x-1/2 bg-[#60A5FA]/8" />
      </div>

      {/* Floating navigation header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-line px-5 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <a href="/" className="flex items-center shrink-0 cursor-pointer">
            <RecruitAuditorWordmark size={30} light />
          </a>
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            {[
              { id: "culture", label: "Culture" },
              { id: "hiring", label: "Process" },
              { id: "team", label: "Team" },
              { id: "tech", label: "Stack" }
            ].map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                {item.label}
              </button>
            ))}
          </nav>
          <a
            href="#apply"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#60A5FA] px-4 py-2 text-xs font-head font-semibold text-[#05060B] shadow-[0_0_30px_-8px_rgba(96,165,250,0.9)] transition hover:bg-[#7FB3FF] cursor-pointer"
          >
            Open Roles
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-6 py-24 md:py-32 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-secondary)]">
          <span className="pulse-dot flex h-2 w-2 rounded-full bg-[#60A5FA]" />
          Careers at RecruitAuditor
        </div>

        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Help build the integrity layer of{" "}
          <span className="text-glow-audit text-[#60A5FA]">autonomous recruiting</span>
        </h1>

        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
          We are the team behind biased-proof, proctored candidate evaluation. Join
          engineers shipping secure sandboxes, telemetry ledgers, and interview
          matrices for hiring teams that refuse to guess.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#apply"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#60A5FA] px-7 py-4 text-sm font-head font-semibold text-[#05060B] shadow-[0_0_44px_-10px_rgba(96,165,250,0.9)] transition hover:bg-[#7FB3FF] cursor-pointer"
          >
            Apply to open roles <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={() => scrollTo("culture")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl glass px-7 py-4 text-sm font-head font-semibold text-white transition hover:bg-white/5 cursor-pointer"
          >
            How we work
          </button>
        </div>

        <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-mono text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#4DE3FF]" /> 48-hour first response
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#4DE3FF]" /> No whiteboard trivia
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#4DE3FF]" /> Production access on day one
          </span>
        </p>
      </section>

      {/* CULTURE & PHILOSOPHY */}
      <section id="culture" className="py-24 px-6 border-t border-line bg-[#0A0D15]/80 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="eyebrow text-[#60A5FA]">Culture &amp; Philosophy</p>
            <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight">Our core operating values</h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              We replace process overhead with absolute clarity and engineering autonomy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Terminal className="w-5 h-5 text-[#60A5FA]" />,
                title: "Technical rigor",
                text: "Clean design systems, strict linting, TypeScript typing, and optimized query layouts. We measure and audit what we build — including our own hiring."
              },
              {
                icon: <Cpu className="w-5 h-5 text-[#60A5FA]" />,
                title: "AI-first workflow",
                text: "We co-program with agentic AI daily, leveraging models for sandbox orchestration, deep telemetry auditing, and evaluation-heavy pipelines."
              },
              {
                icon: <Workflow className="w-5 h-5 text-[#60A5FA]" />,
                title: "Collaborative autonomy",
                text: "Small, tightly aligned teams. You own your code end-to-end: low meeting overhead, high direct impact, rapid release cadences."
              }
            ].map((value, i) => (
              <div
                key={value.title}
                className={`panel p-8 transition-all duration-300 hover:-translate-y-1 ${
                  i === 0 ? "reveal-left" : i === 2 ? "reveal-right" : "reveal-on-scroll"
                }`}
              >
                <span className="logo-tile flex h-12 w-12 items-center justify-center">
                  {value.icon}
                </span>
                <h3 className="mt-5 font-head text-lg font-semibold uppercase tracking-wide">{value.title}</h3>
                <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIRING PROCESS */}
      <section id="hiring" className="py-24 px-6 border-t border-line relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="eyebrow text-[#4DE3FF]">The recruitment path</p>
            <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight">Built on candidate trust</h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              We respect your time. The cycle is streamlined, transparent, and engineer-first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                num: "01",
                title: "Application",
                text: "Submit your GitHub profile, portfolio link, or CV. We respond within 48 hours on real, practical engineering output."
              },
              {
                num: "02",
                title: "Technical assessment",
                text: "Solve a practical, real-world sandbox challenge on our exact stack. No algorithmic trivia or whiteboard balancing."
              },
              {
                num: "03",
                title: "Team sync",
                text: "A 45-minute architectural review with the founders on your solution, design patterns, and engineering philosophy."
              },
              {
                num: "04",
                title: "Rapid onboarding",
                text: "Offer within 24 hours. Direct production write access on day one with dedicated peer support."
              }
            ].map((step, idx) => (
              <div key={step.title} className={`space-y-4 reveal-${idx === 0 ? "left" : idx === 3 ? "right" : "on-scroll"}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#60A5FA]/40 bg-[#60A5FA]/10 font-mono text-xs font-bold text-[#60A5FA]">
                    {step.num}
                  </div>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-[#60A5FA]/60 to-transparent hidden lg:block" />
                </div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[var(--text-primary)]">{step.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="border-t border-line">
        <TeamSection />
      </section>

      {/* TECHNICAL STACK */}
      <section id="tech" className="py-24 px-6 border-t border-line bg-[#0A0D15]/80 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="eyebrow text-[#60A5FA]">Engineering stack</p>
            <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight">Our production environment</h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              Modern, fast, and secure tooling for stable software shipped rapidly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="panel p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#60A5FA]/40"
              >
                <span className="logo-tile flex h-10 w-10 items-center justify-center text-[#60A5FA]">
                  <tech.icon className="w-4 h-4" />
                </span>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-primary)]">{tech.name}</h3>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section id="apply" className="py-24 px-6 border-t border-line relative">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="eyebrow text-[#60A5FA]">Join the mission</p>
            <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight">Launch your application</h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              No formal cover letter needed. Let your work speak for itself.
            </p>
          </div>

          <div className="panel p-6 md:p-10 relative overflow-hidden">
            <div className="accent-edge" />
            {formSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#4EF2BA]/30 bg-[#4EF2BA]/10 text-[#4EF2BA]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-head font-semibold text-[var(--text-primary)]">Application registered</h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                  Thank you for applying to RecruitAuditor. Our team reviews every
                  submission and will reach out within 48 hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg glass px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer"
                >
                  Apply for another role
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Alan Turing"
                      className="hover-pop w-full rounded-xl border border-line bg-[#0D111C] p-3.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--muted)] focus:border-[#60A5FA]/60"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="alan@turing.org"
                      className="hover-pop w-full rounded-xl border border-line bg-[#0D111C] p-3.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--muted)] focus:border-[#60A5FA]/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Target Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="hover-pop w-full rounded-xl border border-line bg-[#0D111C] p-3.5 text-xs text-[var(--text-primary)] outline-none font-mono focus:border-[#60A5FA]/60"
                    >
                      <option value="software-engineer">Software Engineer (Frontend/Core)</option>
                      <option value="systems-architect">Systems Architect (Sandbox Security)</option>
                      <option value="ai-scientist">R&amp;D AI Security Scientist</option>
                      <option value="developer-relations">Developer Advocate / Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">GitHub Profile Link</label>
                    <input
                      type="url"
                      name="github"
                      required
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/turing"
                      className="hover-pop w-full rounded-xl border border-line bg-[#0D111C] p-3.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--muted)] focus:border-[#60A5FA]/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Portfolio or Project Links (Optional)</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://turing.org"
                    className="hover-pop w-full rounded-xl border border-line bg-[#0D111C] p-3.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--muted)] focus:border-[#60A5FA]/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Brief Technical Accomplishments Summary</label>
                  <textarea
                    name="bio"
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Briefly describe an auditing parser, sandbox virtualization, or high-performance frontend component you have deployed."
                    className="hover-pop w-full resize-y rounded-xl border border-line bg-[#0D111C] p-3.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--muted)] focus:border-[#60A5FA]/60"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#60A5FA] py-3.5 text-xs font-head font-bold uppercase tracking-wider text-[#05060B] shadow-[0_0_30px_-10px_rgba(96,165,250,0.9)] transition hover:bg-[#7FB3FF] active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Submit Engineering Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line bg-[#0D111C] py-12 text-center text-xs font-mono text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} RecruitAuditor. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/" className="hover:text-[var(--text-primary)] transition-colors">Corporate Landing</a>
            <a href="/login" className="hover:text-[var(--text-primary)] transition-colors">Audit Console</a>
          </div>
        </div>
      </footer>
    </div>
  );
}