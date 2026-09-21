import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Target,
  ArrowRight,
  Lock,
  Sliders,
  ChevronDown,
  Linkedin,
  Github,
  Mail,
  Search,
  Upload,
  ChevronLeft,
  ChevronRight,
  Download,
  MapPin,
  CheckCircle2,
  X,
  Menu,
  ListChecks,
  Files,
  Scale,
  Users,
  Star,
  Sparkles
} from "lucide-react";
import TeamSection from "./TeamSection";
import { RecruitAuditorLogo, RecruitAuditorWordmark } from "./Logo";

const openJobs = [
  {
    id: "core-rust",
    title: "Core Sandbox Audit Engineer",
    department: "Engineering (Platform)",
    location: "Austin, TX / Remote",
    type: "Full-Time",
    desc: "Build POSIX sandboxes, execution visualizers, and proctoring telemetry ledgers.",
    reqs: ["Rust", "Linux Kernel", "WebSockets", "ebpf"]
  },
  {
    id: "react-architect",
    title: "UX/UI Lead Architect",
    department: "Engineering (Frontend)",
    location: "Austin, TX / Remote",
    type: "Full-Time",
    desc: "Scale the proctoring dashboard, candidate forms, and developer integration consoles.",
    reqs: ["React 19", "Tailwind CSS v4", "Framer Motion", "TypeScript"]
  },
  {
    id: "ai-researcher",
    title: "R&D AI Security Specialist",
    department: "Research & Security",
    location: "Rawalpindi, PK / Hybrid",
    type: "Full-Time",
    desc: "Design evasion protection models and code plagiarism classifiers utilizing LLM telemetry.",
    reqs: ["Python", "PyTorch", "NLP", "Adversarial Machine Learning"]
  }
];

const successStories = [
  {
    logo: "Aether Labs",
    metric: "Hiring time cut by 50%",
    details: "Automated first-round screening for 1,200+ systems applicants while keeping a 0% plagiarism escape rate across proctored workspaces.",
    color: "bg-[#60A5FA]"
  },
  {
    logo: "Quantum Analytics",
    metric: "Screening coverage at 99.8%",
    details: "Every candidate was scored against the posted JD with a written verdict — tab-switching, macro injection, and external-display splits all captured as evidence.",
    color: "bg-[#4DE3FF]"
  },
  {
    logo: "Apex Systems",
    metric: "Fill rate up 40%",
    details: "Replaced whiteboard trivia with role-native challenges and a matching interview matrix, so shortlisted candidates showed up ready for the panel.",
    color: "bg-[#8F7BFF]"
  }
];

interface CorporateLandingProps {
  onLoginRequested?: () => void;
}

export default function CorporateLanding({ onLoginRequested }: CorporateLandingProps) {
  // Config & state
  const [maxResumes, setMaxResumes] = useState(250);
  const [maxTracks, setMaxTracks] = useState(5);
  const [activePreset, setActivePreset] = useState<string>("custom");

  // Job Board States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [uploadedCVName, setUploadedCVName] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUploadSuccess, setCvUploadSuccess] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Success Stories Index State
  const [storyIndex, setStoryIndex] = useState(0);

  // Resource Hub & Newsletter States
  const [hubEmail, setHubEmail] = useState("");
  const [hubSuccess, setHubSuccess] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [inquiries, setInquiries] = useState<any[]>([
    {
      timestamp: "2026-07-08 01:10",
      name: "Arthur Dent",
      company: "Megadodo Publications",
      message: "Looking to deploy automated merit-based screening for galactic field reporters."
    }
  ]);
  const [submittedInquiry, setSubmittedInquiry] = useState(false);

  // Mobile nav state
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll visibility reveal logic
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

  // Pricing presets config
  const presets: Record<string, { price: number; resumes: number; tracks: number }> = {
    starter: { price: 99, resumes: 50, tracks: 2 },
    growth: { price: 299, resumes: 300, tracks: 10 },
    enterprise: { price: 899, resumes: 2000, tracks: 50 }
  };

  const handlePresetSelect = (presetKey: string) => {
    setActivePreset(presetKey);
    const preset = presets[presetKey];
    setMaxResumes(preset.resumes);
    setMaxTracks(preset.tracks);
  };

  // Dynamic custom calculation formula
  const computedPrice = activePreset === "custom"
    ? Math.round((maxResumes * 0.8) + (maxTracks * 35))
    : presets[activePreset]?.price || 0;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    const newInquiry = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      name: contactName,
      company: contactCompany || "Independent Professional",
      message: contactMessage
    };

    setInquiries([newInquiry, ...inquiries]);
    setSubmittedInquiry(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          company: contactCompany || "Independent Professional",
          message: contactMessage
        })
      });
    } catch (err) {
      console.error("Failed to submit contact inbound request:", err);
    }

    setContactName("");
    setContactEmail("");
    setContactCompany("");
    setContactMessage("");

    setTimeout(() => setSubmittedInquiry(false), 4000);
  };

  // Helper to scroll smoothly to section ID
  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goLogin = () => {
    if (onLoginRequested) onLoginRequested();
    else window.location.href = "/login";
  };

  const navItems = [
    { id: "home", label: "Why RecruitAuditor" },
    { id: "success-stories", label: "Results" },
    { id: "plans", label: "Plans" },
    { id: "team", label: "Team" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col relative bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 glass-strong border-b border-line">
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between gap-4">
          <button onClick={() => scrollToSection("home")} className="flex items-center cursor-pointer shrink-0">
            <RecruitAuditorWordmark size={30} light />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-[var(--text-secondary)]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-[var(--text-primary)] transition-colors cursor-pointer font-mono  tracking-[0.14em]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={goLogin}
              className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-xs font-head font-semibold text-ink transition hover:bg-white/5 cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5" />
              Client dashboard
            </button>
            <button
              onClick={() => scrollToSection("plans")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#60A5FA] px-4 py-2 text-xs font-head font-semibold text-[#05060B] shadow-[0_0_30px_-8px_rgba(96,165,250,0.9)] transition hover:bg-[#7FB3FF] cursor-pointer"
            >
              Try RecruitAuditor free
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden inline-flex items-center justify-center rounded-lg glass p-2.5 text-ink cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="lg:hidden glass-strong border-t border-line px-5 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left px-3 py-3 rounded-lg font-mono text-xs  tracking-[0.14em] text-[var(--text-secondary)] hover:text-ink hover:bg-white/5 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={goLogin}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl glass px-4 py-3 text-xs font-head font-semibold text-ink cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5" /> Client dashboard
            </button>
            <button
              onClick={() => scrollToSection("plans")}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#60A5FA] px-4 py-3 text-xs font-head font-semibold text-[#05060B] cursor-pointer"
            >
              Try RecruitAuditor free <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </nav>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section id="home" className="relative overflow-hidden">
        {/* background scaffolds */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 hud-grid" />
          <div className="aurora -top-28 left-[8%] h-80 w-80 bg-[#60A5FA]/16" />
          <div className="aurora top-24 right-[4%] h-72 w-72 bg-[#4DE3FF]/10" />
          <div className="aurora bottom-0 left-1/2 h-64 w-[130%] -translate-x-1/2 bg-[#60A5FA]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 md:px-6 pb-20 pt-16 md:pt-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            {/* Left: copy */}
            <div className="reveal-down visible">
              <div className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-1.5 text-[11px] font-mono  tracking-[0.18em] text-[var(--text-secondary)]">
                <span className="pulse-dot flex h-2 w-2 rounded-full bg-[#60A5FA]" />
                RecruitAuditor · AI CV screening & interview matrix
              </div>

              <h1 className="mt-7 font-display text-[2rem]  leading-[1.05] leading-tight sm:text-5xl lg:text-[3.4rem]">
                Every resume scored against{" "}
                <span className="text-audit">the job you actually posted.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                RecruitAuditor screens a CV against your job description and hands you the
                outcome of a senior recruiter's first pass in about a minute: a compatibility
                score, a skills match table, ready-to-ask interview questions, and a
                proctored SQA-style test matrix — with demographic signals stripped out.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => scrollToSection("plans")}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#60A5FA] px-7 py-4 text-sm font-head font-semibold text-[#05060B] shadow-[0_0_44px_-10px_rgba(96,165,250,0.9)] transition hover:bg-[#7FB3FF] cursor-pointer"
                >
                  Try it free — screen a real resume
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => scrollToSection("results")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl glass px-7 py-4 text-sm font-head font-semibold text-ink transition hover:bg-white/5 cursor-pointer"
                >
                  See what a verdict looks like
                </button>
              </div>

              <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#4DE3FF]" /> One free screening report
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#4DE3FF]" /> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#4DE3FF]" /> Runs on your JD + CVs
                </span>
              </p>
            </div>

            {/* Right: working product surface mock */}
            <div className="reveal-up visible">
              <div className="panel hover-glow relative p-6">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div className="flex items-center gap-2">
                    <span className="pulse-dot flex h-2 w-2 rounded-full bg-[#60A5FA]" />
                    <span className="font-mono text-[10px]  tracking-[0.18em] text-[var(--text-secondary)]">
                      Live screening · Staff Go Engineer
                    </span>
                  </div>
                  <span className="rounded-full bg-[#60A5FA]/10 border border-[#60A5FA]/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#60A5FA]">
                    COMPATIBILITY 87
                  </span>
                </div>

                {/* score + match table */}
                <div className="mt-5 flex items-center gap-5">
                  <div className="relative h-24 w-24 shrink-0">
                    <svg className="h-24 w-24 -rotate-90">
                      <circle cx="48" cy="48" r="42" stroke="rgba(140,160,200,0.14)" strokeWidth="8" fill="none" />
                      <circle cx="48" cy="48" r="42" stroke="#60A5FA" strokeWidth="8" fill="none"
                        strokeDasharray="263.9" strokeDashoffset={263.9 - (263.9 * 87) / 100} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-2xl font-bold text-ink">87</span>
                      <span className="font-mono text-[9px]  tracking-widest text-[var(--muted)]">/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {[
                      { k: "Go / microservices", v: 94 },
                      { k: "Kubernetes deploy", v: 88 },
                      { k: "Terraform IaC", v: 71 },
                      { k: "SQL optimizations", v: 63 }
                    ].map((row) => (
                      <div key={row.k} className="flex items-center gap-3">
                        <span className="w-40 truncate font-mono text-[10px]  tracking-wide text-[var(--text-secondary)]">{row.k}</span>
                        <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${row.v}%`, background: row.v >= 80 ? "#60A5FA" : row.v >= 65 ? "#4DE3FF" : "#8F7BFF" }} />
                        </div>
                        <span className="w-7 text-right font-mono text-[10px] text-ink">{row.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* interview matrix + proctored note */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line bg-paper p-3">
                    <span className="font-mono text-[9px]  tracking-[0.16em] text-[var(--muted)]">Interview matrix</span>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                      5 role-native questions generated from JD gaps.
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-paper p-3">
                    <span className="font-mono text-[9px]  tracking-[0.16em] text-[var(--muted)]">Proctored evidence</span>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                      SQA test matrix attached, anti-cheat telemetry intact.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-secondary)]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#4DE3FF]" />
                    Demographic signals removed
                  </div>
                  <button
                    onClick={() => scrollToSection("plans")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3.5 py-2 text-[11px] font-head font-semibold text-[#60A5FA] transition hover:bg-white/10 cursor-pointer"
                  >
                    Run this on my JD <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* trust stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { v: "≈80s", l: "to first verdict" },
                  { v: "0", l: "demographic bias signals" },
                  { v: "5", l: "interview Qs per shortlist" },
                  { v: "100%", l: "proctored, on-record" }
                ].map((s) => (
                  <div key={s.l} className="text-center">
                    <p className="font-display md:text-2xl">{s.v}</p>
                    <p className="mt-1 text-[10px]  tracking-[0.18em] text-[var(--muted)]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <ChevronDown className="h-6 w-6 animate-bounce text-[var(--muted)]" />
          </div>
        </div>
      </section>

      {/* ================= WHY / CAPABILITIES ================= */}
      <section id="why-us" className="border-y border-line bg-paper py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="max-w-2xl">
            <p className="badge-label text-muted">Why RecruitAuditor</p>
            <h2 className="mt-2 font-display">
              The screening pass that fills roles, not inboxes
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
              You post a JD, candidates apply, and instead of a black hole you get a ranked,
              evidence-backed shortlist with the questions and tests already drafted for the
              interview round. Free to run once on your real CVs.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: <Scale className="h-5 w-5 text-[#60A5FA]" />,
                title: "Bias-free, evidence-driven",
                text: "Names, locations, universities and ages are stripped before scoring. The compatibility figure and match table are generated from skill evidence alone — defensible in review, not vibes."
              },
              {
                icon: <ListChecks className="h-5 w-5 text-[#60A5FA]" />,
                title: "Interview matrix included",
                text: "Every shortlisted CV comes with role-native interview questions mapped to the JD, so your panel stops ad-libbing and starts verifying the exact gaps the screen found."
              },
              {
                icon: <Files className="h-5 w-5 text-[#60A5FA]" />,
                title: "SQA test matrix attached",
                text: "Screening outputs pair with a proctored, anti-cheat SQA test matrix — keystroke and focus telemetry on record for every candidate who advances."
              }
            ].map((f, i) => (
              <div
                key={f.title}
                className={`panel reveal-${i === 0 ? "left" : i === 2 ? "right" : "on-scroll"} p-7`}
              >
                <span className="logo-tile flex h-12 w-12 items-center justify-center transition group-hover:scale-105">
                  {f.icon}
                </span>
                <h3 className="mt-5 font-head text-lg font-semibold  tracking-wide">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SUCCESS STORIES ================= */}
      <section id="results" className="py-20">
        <div className="mx-auto max-w-5xl px-5 md:px-6">
          <div className="text-center">
            <p className="badge-label text-muted">Verified results</p>
            <h2 className="mt-2 font-display">
              Measurable outcomes for talent teams
            </h2>
          </div>

          <div className="panel mt-12 p-6 md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-stretch">
              <div className={`rounded-2xl ${successStories[storyIndex].color} p-8 flex flex-col justify-center text-[#05060B] relative overflow-hidden`}>
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                <span className="font-mono text-xs font-bold opacity-80">
                  {successStories[storyIndex].logo}
                </span>
                <span className="mt-2 font-display text-2xl font-bold leading-tight leading-tight">
                  {successStories[storyIndex].metric}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-6">
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  "{successStories[storyIndex].details}"
                </p>

                <div className="flex items-center justify-between border-t border-line pt-4">
                  <div className="flex gap-2">
                    {successStories.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setStoryIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          storyIndex === idx ? "w-6 bg-[#60A5FA]" : "w-2 bg-white/15"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStoryIndex((prev) => (prev === 0 ? successStories.length - 1 : prev - 1))}
                      className="p-2.5 rounded-lg glass text-ink hover:bg-white/10 transition-all cursor-pointer"
                      aria-label="Previous story"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoryIndex((prev) => (prev === successStories.length - 1 ? 0 : prev + 1))}
                      className="p-2.5 rounded-lg glass text-ink hover:bg-white/10 transition-all cursor-pointer"
                      aria-label="Next story"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PLANS ================= */}
      <section id="plans" className="border-y border-line bg-paper py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="badge-label text-muted">Pricing</p>
            <h2 className="mt-2 font-display">
              Start free on a real resume
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              One free screening report, no credit card. Then pick the capacity that matches
              your pipeline with the slider below.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            {/* Custom pricing calculator */}
            <div className="panel p-6 space-y-6 lg:col-span-8">
              <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                <h4 className="flex items-center gap-2 font-head text-base font-semibold">
                  <Sliders className="h-4 w-4 text-[#60A5FA]" />
                  Capacity calculator
                </h4>
                <span className="rounded-full bg-[#60A5FA]/10 border border-[#60A5FA]/30 px-3 py-1 font-mono text-xs font-bold text-[#60A5FA]">
                  ${computedPrice}/mo
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between items-end">
                    <span className="font-head text-sm text-[var(--text-primary)]">Resumes screened monthly</span>
                    <span className="font-mono text-xs font-bold text-[#60A5FA]">{maxResumes} resumes</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={maxResumes}
                    onChange={(e) => { setMaxResumes(Number(e.target.value)); setActivePreset("custom"); }}
                    className="w-full cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-[var(--muted)]">
                    <span>10</span>
                    <span>1,000</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between items-end">
                    <span className="font-head text-sm text-[var(--text-primary)]">Active candidate test tracks</span>
                    <span className="font-mono text-xs font-bold text-[#60A5FA]">{maxTracks} tracks</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={maxTracks}
                    onChange={(e) => { setMaxTracks(Number(e.target.value)); setActivePreset("custom"); }}
                    className="w-full cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-[var(--muted)]">
                    <span>1</span>
                    <span>30</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-line pt-5">
                {[
                  { key: "starter", name: "Starter", price: "$99" },
                  { key: "growth", name: "Growth", price: "$299" },
                  { key: "enterprise", name: "Enterprise", price: "$899" }
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => handlePresetSelect(p.key)}
                    className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      activePreset === p.key
                        ? "border-[#60A5FA] bg-[#60A5FA]/10 shadow-[0_0_20px_-8px_rgba(96,165,250,0.6)]"
                        : "border-line bg-paper hover:border-[#60A5FA]/40"
                    }`}
                  >
                    <div className="font-head text-xs font-semibold  tracking-wide text-[var(--text-primary)]">{p.name}</div>
                    <div className="mt-0.5 font-mono text-lg font-bold text-[#60A5FA]">{p.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Entitlements */}
            <div className="panel p-6 space-y-4 lg:col-span-4">
              <h4 className="font-head text-base font-semibold">What every plan includes</h4>
              <ul className="space-y-3 text-xs text-[var(--text-secondary)]">
                {[
                  "One free screening report before you pay",
                  "Compatibility score + skills match table",
                  "JD-mapped interview questions",
                  "Proctored SQA test matrix with anti-cheat telemetry",
                  "Demographic anonymization on every CV",
                  "Email dispatch for candidate outcomes"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4DE3FF]" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollToSection("contact")}
                className="btn-brand w-full rounded-xl bg-[#60A5FA] py-3 text-xs font-head font-semibold text-[#05060B] shadow-[0_0_30px_-10px_rgba(96,165,250,0.9)] hover:bg-[#7FB3FF] cursor-pointer"
              >
                Start a free screening report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLIENTS ================= */}
      <section id="clients" className="py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="badge-label text-muted">Talent teams</p>
            <h2 className="mt-2 font-display">
              Trust validated by hiring leads
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <figure className="panel p-7 reveal-left">
              <div className="flex items-center justify-between">
                <span className="font-head text-sm font-semibold text-[var(--text-primary)]">Genesis Logistics Group</span>
                <div className="flex text-[#FFC53D]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] italic">
                "We screened 1,500 dispatch-resume CVs against a single JD. Anonymization
                killed the bias debates and the rank order matched what our best hires looked
                like in year one."
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4 font-mono text-[11px] text-[var(--muted)]">
                — HR Director, Genesis Group
              </figcaption>
            </figure>

            <figure className="panel p-7 reveal-right">
              <div className="flex items-center justify-between">
                <span className="font-head text-sm font-semibold text-[var(--text-primary)]">Quantum Analytics Inc</span>
                <div className="flex text-[#FFC53D]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] italic">
                "The interview matrix alone changed our panel. Candidates arrive ready to
                discuss the exact gaps RecruitAuditor flagged, and the proctored matrix gives
                us evidence instead of impressions."
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4 font-mono text-[11px] text-[var(--muted)]">
                — VP of Technology, Quantum Analytics
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <TeamSection />

      {/* ================= JOB BOARD ================= */}
      <section id="jobs" className="border-t border-line py-20">
        <div className="mx-auto max-w-5xl px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="badge-label text-muted">Careers board</p>
            <h2 className="mt-2 font-display">
              We screen applicants the way we sell screening
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              Open roles at the team building RecruitAuditor.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-md relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search open positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl glass py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition hover:bg-white/5 focus:border-[#60A5FA]/50 focus:ring-1 focus:ring-[#60A5FA]/30"
            />
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-4">
            {openJobs
              .filter((job) =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.reqs.some((req) => req.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((job) => (
                <div key={job.id} className="panel flex flex-col justify-between gap-6 p-6 transition-all duration-300 hover:border-[#60A5FA]/30 md:flex-row md:items-center">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-head text-base font-semibold text-[var(--text-primary)]">{job.title}</h4>
                      <span className="rounded-full border border-line bg-white/5 px-2.5 py-0.5 font-mono text-[10px] font-bold  tracking-wider text-[var(--muted)]">{job.type}</span>
                    </div>
                    <p className="font-mono text-[11px]  tracking-[0.14em] text-[var(--muted)]">
                      {job.department} | {job.location}
                    </p>
                    <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">{job.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.reqs.map((req) => (
                        <span key={req} className="rounded border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">{req}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(job);
                      setApplySuccess(false);
                      setUploadedCVName("");
                      setCvUploadSuccess(false);
                      setApplicantName("");
                      setApplicantEmail("");
                    }}
                    className="shrink-0 rounded-lg bg-[#60A5FA] px-5 py-2.5 text-xs font-head font-semibold text-[#05060B] transition hover:bg-[#7FB3FF] cursor-pointer"
                  >
                    Quick apply
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Apply Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
            <div className="w-full max-w-md panel p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-head text-base font-semibold">Quick apply</h4>
                  <p className="mt-0.5 font-mono text-[11px] text-[var(--muted)]">{selectedJob.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="rounded-lg p-2 text-[var(--muted)] hover:text-ink hover:bg-white/5 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {applySuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4EF2BA]/10 border border-[#4EF2BA]/30 text-[#4EF2BA]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h5 className="font-head text-sm font-semibold">Application submitted</h5>
                  <p className="mx-auto max-w-xs text-xs leading-relaxed text-[var(--text-secondary)]">
                    Your application and CV ({uploadedCVName}) were logged. We respond within
                    48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="btn-brand rounded-lg glass px-5 py-2 text-[11px] font-mono font-bold  tracking-wider text-ink"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!cvUploadSuccess) return;
                    try {
                      await fetch("/api/apply", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: applicantName,
                          email: applicantEmail,
                          role: selectedJob.title
                        })
                      });
                      setApplySuccess(true);
                    } catch (err) {
                      console.error("Failed to submit job application:", err);
                      setApplySuccess(true);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="mb-1 block font-mono text-[10px]  tracking-wider text-[var(--muted)]">Full name</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#60A5FA]/60"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-mono text-[10px]  tracking-wider text-[var(--muted)]">Email address</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#60A5FA]/60"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-mono text-[10px]  tracking-wider text-[var(--muted)]">Upload CV (PDF/DOCX)</label>
                    {cvUploadSuccess ? (
                      <div className="flex items-center justify-between rounded-lg border border-[#4EF2BA]/30 bg-[#4EF2BA]/10 px-3 py-2.5 font-mono text-xs text-[#4EF2BA]">
                        <span className="truncate">{uploadedCVName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedCVName("");
                            setCvUploadSuccess(false);
                          }}
                          className="ml-2 rounded p-1 text-[#4EF2BA]/70 hover:text-[#4EF2BA] cursor-pointer"
                          aria-label="Remove CV"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative rounded-lg border border-dashed border-line p-6 text-center transition-all hover:border-[#60A5FA]/50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          required
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCvUploading(true);
                              setUploadedCVName(file.name);
                              setTimeout(() => {
                                setCvUploading(false);
                                setCvUploadSuccess(true);
                              }, 1500);
                            }
                          }}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                        <Upload className="mx-auto mb-2 h-5 w-5 text-[var(--muted)]" />
                        <p className="font-mono text-[11px] text-[var(--text-secondary)]">
                          {cvUploading ? "Uploading CV file..." : "Drag & drop or click to upload CV"}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!cvUploadSuccess}
                    className="w-full rounded-xl bg-[#60A5FA] py-3 text-xs font-head font-semibold text-[#05060B] transition hover:bg-[#7FB3FF] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Submit application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ================= RESOURCE HUB ================= */}
      <section id="resources" className="border-t border-line bg-paper py-20">
        <div className="mx-auto max-w-5xl px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="badge-label text-muted">Resource hub</p>
            <h2 className="mt-2 font-display">
              The AI hiring & telemetry guide
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              How to structure anonymous screening, proctor practical tests, and stop
              copy-paste leakage without breaking candidate trust.
            </p>
          </div>

          <div className="panel mx-auto mt-12 max-w-3xl p-8 md:p-10">
            {hubSuccess ? (
              <div className="flex items-start gap-3 rounded-xl border border-[#4EF2BA]/30 bg-[#4EF2BA]/10 p-4 text-xs text-[#4EF2BA]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <span className="font-bold">Download registered.</span> Your guide is ready:{" "}
                  <a
                    href="/RecruitAI_Engine_Hiring_Recruitment_Guide.pdf"
                    download="RecruitAI_Engine_Hiring_Recruitment_Guide.pdf"
                    className="underline font-bold text-[#9BF2D8] hover:text-ink"
                  >
                    click here to download (PDF)
                  </a>
                </div>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!hubEmail) return;
                  try {
                    await fetch("/api/hub-download", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: hubEmail })
                    });
                    const link = document.createElement("a");
                    link.href = "/RecruitAI_Engine_Hiring_Recruitment_Guide.pdf";
                    link.download = "RecruitAI_Engine_Hiring_Recruitment_Guide.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } catch (err) {
                    console.error("Failed to register hub download:", err);
                  }
                  setHubSuccess(true);
                }}
                className="flex flex-col gap-2.5 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter email to receive the guide..."
                  value={hubEmail}
                  onChange={(e) => setHubEmail(e.target.value)}
                  className="flex-1 rounded-xl glass px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--muted)] hover:bg-white/5 focus:border-[#60A5FA]/50"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#60A5FA] px-6 py-3 text-xs font-head font-semibold text-[#05060B] transition hover:bg-[#7FB3FF] cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Get guide
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="border-t border-line py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Inquiry form */}
            <div className="panel p-6 space-y-6 lg:col-span-7">
              <div>
                <h4 className="font-head text-base font-semibold">Request a free screening report</h4>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Tell us about your pipeline and we will screen a real resume for free.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-mono text-[10px]  tracking-wider text-[var(--muted)]">Full name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="hover-pop w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#60A5FA]/60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px]  tracking-wider text-[var(--muted)]">Corporate email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="hover-pop w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#60A5FA]/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[10px]  tracking-wider text-[var(--muted)]">Company (optional)</label>
                  <input
                    type="text"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    className="hover-pop w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#60A5FA]/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[10px]  tracking-wider text-[var(--muted)]">Inquiry message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Role you hire for, monthly candidate volume, or a specific screening problem..."
                    className="hover-pop w-full resize-none rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#60A5FA]/60"
                  />
                </div>

                {submittedInquiry && (
                  <div className="flex items-center gap-2 rounded-lg border border-[#4EF2BA]/30 bg-[#4EF2BA]/10 p-2.5 font-mono text-xs text-[#4EF2BA]">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Inquiry logged. Your free report is queued.
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#60A5FA] py-3 text-xs font-head font-semibold text-[#05060B] transition hover:bg-[#7FB3FF] cursor-pointer"
                >
                  Request free screening report
                </button>
              </form>
            </div>

            {/* Inquiry log */}
            <div className="space-y-6 lg:col-span-5">
              <div>
                <h4 className="font-head text-base font-semibold">Recent requests</h4>
                <p className="text-xs text-[var(--text-secondary)]">Log of screening inquiries from talent teams.</p>
              </div>
              <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
                {inquiries.map((iq, idx) => (
                  <div key={idx} className="panel p-4 font-mono text-[11px]">
                    <div className="flex justify-between text-[var(--muted)]">
                      <span>{iq.name} ({iq.company})</span>
                      <span>{iq.timestamp}</span>
                    </div>
                    <div className="mt-1.5 text-[var(--text-primary)] italic">"{iq.message}"</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= READY CTA ================= */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 hud-grid" />
          <div className="aurora left-1/4 top-0 h-72 w-72 bg-[#60A5FA]/14" />
          <div className="aurora right-[8%] bottom-0 h-72 w-72 bg-[#4DE3FF]/10" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-6">
          <p className="badge-label text-muted">Go operational</p>
          <h2 className="mt-3 font-display">
            Screen a real resume tonight.
            <br />
            <span className="text-audit">Free, on us.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            One free report on the job you are hiring for today. Compatibility score, match
            table, interview questions and a proctored SQA matrix — no credit card.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => scrollToSection("plans")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#60A5FA] px-8 py-3.5 text-sm font-head font-semibold text-[#05060B] shadow-[0_0_44px_-10px_rgba(96,165,250,0.9)] transition hover:bg-[#7FB3FF] cursor-pointer"
            >
              Try RecruitAuditor free <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => window.location.href = "/careers"}
              className="inline-flex items-center gap-2 rounded-xl glass px-8 py-3.5 text-sm font-head font-semibold text-ink transition hover:bg-white/5 cursor-pointer"
            >
              Explore careers
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative border-t border-line bg-paper pb-10 pt-16">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="grid grid-cols-1 gap-10 border-b border-line pb-12 md:grid-cols-12">
            {/* Logo & description */}
            <div className="md:col-span-5 space-y-4">
              <button onClick={() => scrollToSection("home")} className="cursor-pointer">
                <RecruitAuditorWordmark size={30} light />
              </button>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
                The AI CV screening and interview matrix engine for talent teams — compatibility
                scores, match tables and proctored SQA test matrices on every shortlist.
              </p>
              <div className="flex items-center gap-3 pt-1">
                {[
                  { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
                  { icon: <Github className="h-4 w-4" />, label: "GitHub" },
                  { icon: <Mail className="h-4 w-4" />, label: "Email" }
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#home"
                    onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
                    className="rounded-lg glass p-2.5 text-[var(--text-secondary)] transition hover:border-[#60A5FA]/40 hover:text-[#60A5FA]"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Offices */}
            <div className="md:col-span-4 space-y-4">
              <h5 className="font-mono text-xs font-bold  tracking-wider text-[var(--text-primary)]">Offices</h5>
              <div className="space-y-4 font-mono text-xs text-[var(--text-secondary)]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#60A5FA]" />
                  <div>
                    <span className="block font-bold text-[var(--text-primary)]">Huddersfield, UK</span>
                    <span>Thornton Hills, United Kingdom</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4DE3FF]" />
                  <div>
                    <span className="block font-bold text-[var(--text-primary)]">Islamabad, PK</span>
                    <span>Sector I-8, Pakistan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-3 space-y-4">
              <h5 className="font-mono text-xs font-bold  tracking-wider text-[var(--text-primary)]">Audit newsletter</h5>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Screening frameworks and proctoring updates, monthly.
              </p>
              {newsletterSuccess ? (
                <div className="rounded-xl border border-[#4EF2BA]/30 bg-[#4EF2BA]/10 px-3 py-2.5 font-mono text-xs text-[#4EF2BA]">
                  Registered successfully.
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newsletterEmail) return;
                    try {
                      await fetch("/api/newsletter", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: newsletterEmail })
                      });
                    } catch (err) {
                      console.error("Failed to register newsletter subscription:", err);
                    }
                    setNewsletterSuccess(true);
                  }}
                  className="space-y-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full rounded-xl glass px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--muted)] hover:bg-white/5 focus:border-[#60A5FA]/50"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#60A5FA] py-2.5 text-xs font-head font-semibold text-[#05060B] transition hover:bg-[#7FB3FF] cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-8 font-mono text-[11px] text-[var(--muted)] sm:flex-row">
            <p>© {new Date().getFullYear()} RecruitAuditor. Bias-free screening, proctored evidence. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/careers" className="transition-colors hover:text-ink">Careers</a>
              <a href="/login" className="transition-colors hover:text-ink">Client console</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}