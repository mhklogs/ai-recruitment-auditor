import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Users, 
  HelpCircle, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  TrendingUp, 
  Terminal, 
  Sliders, 
  ExternalLink,
  ShieldAlert,
  ChevronDown,
  Linkedin,
  Github,
  Mail,
  Briefcase,
  User,
  UserPlus,
  Search,
  Upload,
  ChevronLeft,
  ChevronRight,
  Download,
  MapPin,
  Twitter,
  Globe,
  Cpu
} from "lucide-react";
import TeamSection from "./TeamSection";

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
    metric: "Hiring time reduced by 50%",
    details: "Successfully automated first-round screening for 1,200+ systems applicants, maintaining 0% plagiarism escape rate.",
    color: "from-blue-600 to-cyan-500"
  },
  {
    logo: "Quantum Analytics",
    metric: "Auditor coverage at 99.8%",
    details: "Deployed sandboxed browser metrics detecting tab-switching, keyboard macro injections, and external display splits.",
    color: "from-rose-600 to-red-500"
  },
  {
    logo: "Apex Systems",
    metric: "40% rise in onboarding quality",
    details: "Replaced whiteboard algorithmic trivia with sandbox-based practical challenges directly related to production tasks.",
    color: "from-purple-600 to-indigo-500"
  }
];

function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseColor: string;
    }> = [];

    const particleCount = 70;
    const colors = [
      "rgba(30, 58, 138, 0.4)", // Navy Blue
      "rgba(190, 18, 60, 0.4)", // Red
    ];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        baseColor: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Move particle
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce on borders
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Interactive mouse repulsion
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p1.x += (dx / dist) * force * 3;
          p1.y += (dy / dist) * force * 3;
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.baseColor;
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distBetween = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (distBetween < 110) {
            const alpha = (110 - distBetween) / 110 * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(138, 63, 252, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

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
        ".reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale, .reveal-down"
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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col relative select-none">
      
      {/* Dynamic Header Sticky Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-opacity-70 bg-[var(--bg-primary)] border-b border-[var(--border-color)] transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollToSection("home")}>
            <div className="bg-gradient-to-br from-blue-900 to-red-600 p-2 rounded-xl text-white shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-sm tracking-widest text-[var(--text-primary)]">
              RECRUITAI <span className="text-red-500 font-normal">ENGINE</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-secondary)]">
            <button onClick={() => scrollToSection("home")} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Home</button>
            <button onClick={() => scrollToSection("why-us")} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Why Us</button>
            <button onClick={() => scrollToSection("team")} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Our Team</button>
            <button onClick={() => scrollToSection("plans")} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Our Plans</button>
            <button onClick={() => scrollToSection("clients")} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Clients</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Contact Us</button>
            <button onClick={() => window.location.href = "/login"} className="bg-gradient-to-r from-blue-900 to-red-600 text-white px-4 py-1.5 rounded-lg cursor-pointer hover:opacity-90">Client Dashboard</button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative py-20 overflow-hidden">
        
        {/* Playful Interactive Particle Background Screen */}
        <CanvasBackground />

        {/* Glow overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-900/10 via-red-900/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-4xl space-y-6 reveal-down visible z-10">


          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)]">
            Objective Merit.<br />
            <span className="bg-gradient-to-r from-blue-500 via-red-500 to-purple-500 bg-clip-text text-transparent">
              Unparalleled Integrity.
            </span>
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Eliminate the "candidate black hole". Parse resumes anonymously based on actual code complexity and keystroke telemetry without demographic filters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection("plans")}
              className="hover-pop w-full sm:w-auto bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-xs font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              Configure Subscription Tier
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection("why-us")}
              className="hover-pop w-full sm:w-auto bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold py-3.5 px-8 rounded-xl cursor-pointer"
            >
              Explore Capabilities
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce cursor-pointer z-10 animate-pulse" onClick={() => scrollToSection("why-us")}>
          <ChevronDown className="w-6 h-6 text-[var(--text-secondary)]" />
        </div>
      </section>

      {/* WHY US (CAPABILITIES) SECTION */}
      <section id="why-us" className="py-24 bg-[var(--bg-card)] border-y border-[var(--border-color)] px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 reveal-down">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">Monitored Verification Engine</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Why B2B Leaders Choose RecruitAI</h3>
            <p className="text-xs text-[var(--text-secondary)]">We audit actual capabilities using secure, telemetry-backed proctor nodes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hover-pop bg-[var(--bg-primary)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4 shadow-sm reveal-left">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Anti-Cheat Proctoring</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Dual-engine focus monitoring. Instantly terminates candidate workspaces upon tab evasions or focus loss, locking access and flagging suspicious activity.
              </p>
            </div>

            <div className="hover-pop bg-[var(--bg-primary)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4 shadow-sm reveal-scale">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Demographic Anonymization</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Strips out names, age variables, location metrics, and specific universities to parse candidate resumes strictly on skills merit.
              </p>
            </div>

            <div className="hover-pop bg-[var(--bg-primary)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4 shadow-sm reveal-right">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shadow-inner">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Database Consolidation</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Maintains a permanent, POSIX atomic-backed index ledger of all historical exam sessions, keystroke dynamics, and evaluations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES SECTION */}
      <section id="success-stories" className="py-24 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-card)] border-y border-[var(--border-color)] px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 reveal-down">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">Success Stories</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Measurable B2B Impact</h3>
            <p className="text-xs text-[var(--text-secondary)]">How global technical teams leverage the RecruitAI audit engine.</p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-900 to-red-600" />
            
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              {/* Metric Card */}
              <div className={`w-full md:w-1/3 rounded-2xl bg-gradient-to-br ${successStories[storyIndex].color} p-8 flex flex-col justify-center text-white shadow-md relative overflow-hidden`}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <span className="text-sm font-mono tracking-widest uppercase opacity-70 mb-2">{successStories[storyIndex].logo}</span>
                <span className="text-2xl md:text-3xl font-black leading-tight tracking-tight">{successStories[storyIndex].metric}</span>
              </div>

              {/* Details Column */}
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4.5 h-4.5 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4.5 h-4.5 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4.5 h-4.5 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4.5 h-4.5 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4.5 h-4.5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
                    "{successStories[storyIndex].details}"
                  </p>
                </div>

                {/* Navigation controls */}
                <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
                  <div className="flex gap-2">
                    {successStories.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setStoryIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          storyIndex === idx ? "bg-red-500 w-6" : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStoryIndex((prev) => (prev === 0 ? successStories.length - 1 : prev - 1))}
                      className="p-2 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoryIndex((prev) => (prev === successStories.length - 1 ? 0 : prev + 1))}
                      className="p-2 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANS (INTERACTIVE SELECTOR) SECTION */}
      <section id="plans" className="py-24 bg-[var(--bg-card)] border-y border-[var(--border-color)] px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 reveal-down">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">B2B Service Subscriptions</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Interactive Tier Capacity Selector</h3>
            <p className="text-xs text-[var(--text-secondary)]">Slide parameters below to estimate customized B2B billing rates.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Custom pricing sliders */}
            <div className="lg:col-span-8 bg-[var(--bg-primary)] border border-[var(--border-color)] p-6 rounded-2xl space-y-6 shadow-sm reveal-left">
              
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-red-500" />
                  Custom Capacity Calculator
                </h4>
                <span className="text-xs bg-[#be123c]/10 text-red-500 border border-[#be123c]/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  Estimated: ${computedPrice}/mo
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs text-[var(--text-primary)] mb-1">
                    <span>Monthly Resume Parsing Limit</span>
                    <span className="font-bold text-red-500">{maxResumes} Resumes</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={maxResumes}
                    onChange={(e) => { setMaxResumes(Number(e.target.value)); setActivePreset("custom"); }}
                    className="w-full cursor-pointer h-1.5 bg-[var(--border-color)] rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--text-secondary)] mt-1 font-mono">
                    <span>10 Resumes</span>
                    <span>1,000 Resumes</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[var(--text-primary)] mb-1">
                    <span>Active Candidate Test Tracks</span>
                    <span className="font-bold text-red-500">{maxTracks} Tracks</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={maxTracks}
                    onChange={(e) => { setMaxTracks(Number(e.target.value)); setActivePreset("custom"); }}
                    className="w-full cursor-pointer h-1.5 bg-[var(--border-color)] rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--text-secondary)] mt-1 font-mono">
                    <span>1 Track</span>
                    <span>30 Tracks</span>
                  </div>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--border-color)]">
                <button
                  onClick={() => handlePresetSelect("starter")}
                  className={`hover-pop border text-left p-3 rounded-xl transition-all cursor-pointer ${
                    activePreset === "starter" 
                      ? "border-[#be123c] bg-[#be123c]/5" 
                      : "border-[var(--border-color)] bg-[var(--bg-card)] hover:border-gray-500"
                  }`}
                >
                  <div className="text-[10px] font-bold text-[var(--text-primary)]">Starter Preset</div>
                  <div className="text-sm font-bold text-red-500 mt-0.5">$99</div>
                </button>

                <button
                  onClick={() => handlePresetSelect("growth")}
                  className={`hover-pop border text-left p-3 rounded-xl transition-all cursor-pointer ${
                    activePreset === "growth" 
                      ? "border-[#be123c] bg-[#be123c]/5" 
                      : "border-[var(--border-color)] bg-[var(--bg-card)] hover:border-gray-500"
                  }`}
                >
                  <div className="text-[10px] font-bold text-[var(--text-primary)]">Growth Preset</div>
                  <div className="text-sm font-bold text-red-500 mt-0.5">$299</div>
                </button>

                <button
                  onClick={() => handlePresetSelect("enterprise")}
                  className={`hover-pop border text-left p-3 rounded-xl transition-all cursor-pointer ${
                    activePreset === "enterprise" 
                      ? "border-[#be123c] bg-[#be123c]/5" 
                      : "border-[var(--border-color)] bg-[var(--bg-card)] hover:border-gray-500"
                  }`}
                >
                  <div className="text-[10px] font-bold text-[var(--text-primary)]">Enterprise Preset</div>
                  <div className="text-sm font-bold text-red-500 mt-0.5">$899</div>
                </button>
              </div>

            </div>

            {/* Static tier visual details */}
            <div className="lg:col-span-4 bg-[var(--bg-primary)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4 shadow-sm reveal-right">
              <h4 className="text-sm font-bold text-[var(--text-primary)]">B2B Core Entitlements</h4>
              <ul className="text-xs text-[var(--text-secondary)] space-y-2.5">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  POSIX Atomic Lock Protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Keystroke dynamics matching
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  AI code-plagiarism scoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  SLA Monitoring & automated feedback
                </li>
              </ul>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover-pop w-full bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer shadow"
              >
                Acquire Corporate License
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* CLIENTS (TESTIMONIALS) SECTION */}
      <section id="clients" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 reveal-down">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">Satisfied Corporate Clients</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Trust Validated by Real Leaders</h3>
            <p className="text-xs text-[var(--text-secondary)]">Read metadata comments left by verified enterprise audit handlers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="hover-pop bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-3 shadow-sm reveal-left">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-primary)]">Genesis Logistics Group</span>
                <div className="flex text-yellow-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                "We parsed 1,500 candidate resumes for our dispatch software team. Anonymizing names and universities removed biases entirely, and the technical merit ratings proved 100% accurate."
              </p>
              <div className="text-[10px] text-gray-500 font-mono">- HR Director, Genesis Group</div>
            </div>

            <div className="hover-pop bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-3 shadow-sm reveal-right">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-primary)]">Quantum Analytics Inc</span>
                <div className="flex text-yellow-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                "The 4-hour submission lock is a brilliant feature. It lets our engineering panel review detailed typing events and plagiarism flags before auto-releasing the candidate's grading cards."
              </p>
              <div className="text-[10px] text-gray-500 font-mono">- VP of Technology, Quantum Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <TeamSection />

      {/* JOB BOARD SECTION */}
      <section id="jobs" className="py-24 px-6 border-t border-[var(--border-color)] relative">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2 reveal-down">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">Careers Board</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Open Engineering Roles</h3>
            <p className="text-xs text-[var(--text-secondary)]">Search and apply to join our high-performance infrastructure teams.</p>
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative reveal-on-scroll">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search engineering positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-4 text-xs text-[var(--text-primary)] focus:outline-none focus:border-red-500/50 hover:bg-[var(--bg-card-hover)] transition-all"
            />
          </div>

          {/* Jobs List */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {openJobs
              .filter((job) =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.reqs.some((req) => req.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((job) => (
                <div
                  key={job.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:shadow-[var(--glow-shadow)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">{job.title}</h4>
                      <span className="text-[8px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{job.type}</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] font-mono">{job.department} | {job.location}</p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-2xl">{job.desc}</p>
                    
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.reqs.map((req, i) => (
                        <span key={i} className="text-[8px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">{req}</span>
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
                    className="w-full md:w-auto shrink-0 text-center px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-lg shadow-md hover:shadow-red-950/20 transition-all cursor-pointer"
                  >
                    Quick Apply
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Apply Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 to-blue-905" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Quick Apply</h4>
                  <p className="text-[10px] text-[var(--text-secondary)] font-mono">{selectedJob.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="text-xs text-gray-500 hover:text-[var(--text-primary)] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {applySuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-[var(--text-primary)]">Application Submitted</h5>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">
                    Your application and CV ({uploadedCVName}) were successfully logged in our systems. We will reach out to you within 48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
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
                    <label className="block text-[9px] text-gray-400 font-mono uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-gray-400 font-mono uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-gray-400 font-mono uppercase mb-1">Upload CV (PDF/DOCX)</label>
                    
                    {cvUploadSuccess ? (
                      <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-lg text-[10px] text-green-400 font-mono">
                        <span>✓ {uploadedCVName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedCVName("");
                            setCvUploadSuccess(false);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="relative border border-dashed border-[var(--border-color)] hover:border-red-500/40 rounded-lg p-6 text-center cursor-pointer transition-all">
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
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                        <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                          {cvUploading ? "Uploading CV file..." : "Drag & Drop or Click to upload CV"}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!cvUploadSuccess}
                    className="w-full bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* RESOURCE HUB SECTION */}
      <section id="resources" className="py-24 bg-[var(--bg-card)]/50 border-t border-[var(--border-color)] px-6 relative">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2 reveal-down">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">Resource Hub</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Technical Insights & Guides</h3>
            <p className="text-xs text-[var(--text-secondary)]">Stay ahead with auditing whitepapers and proctoring best-practice frameworks.</p>
          </div>

          {/* Lead Magnet Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 md:p-10 max-w-3xl mx-auto relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center gap-8 reveal-on-scroll">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Guide Preview Visual */}
            <div className="w-full md:w-1/3 aspect-[3/4] bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-red-500/20" />
              <Cpu className="w-8 h-8 text-red-500" />
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono text-red-400 tracking-wider uppercase font-bold">Whitepaper</span>
                <h5 className="text-xs font-bold text-[var(--text-primary)] leading-snug">The Complete AI Hiring & Telemetry Guide</h5>
                <p className="text-[8px] text-[var(--text-secondary)] font-mono">v2.4 Audit Frameworks</p>
              </div>
            </div>

            {/* Description & form */}
            <div className="flex-1 space-y-6 w-full">
              <div className="space-y-2">
                <h4 className="text-base font-bold text-[var(--text-primary)]">Download Our AI Hiring & Telemetry Guide</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Learn how to structure secure coding sandboxes, analyze candidate keystroke dynamics, and prevent LLM plagiarism leakage without sacrificing candidate trust.
                </p>
              </div>

              {hubSuccess ? (
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3 text-[10px] text-green-400 font-mono animate-fade-in">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Download Registered</span>
                    <span>Your guide is ready. <a href="/RecruitAI_Engine_Hiring_Recruitment_Guide.pdf" download="RecruitAI_Engine_Hiring_Recruitment_Guide.pdf" className="underline font-bold text-green-300 hover:text-green-200">Click here to download (PDF)</a></span>
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
                      
                      // Programmatically trigger download
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
                  className="flex flex-col sm:flex-row gap-2.5"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter email to receive whitepaper..."
                    value={hubEmail}
                    onChange={(e) => setHubEmail(e.target.value)}
                    className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-4 py-3 rounded-xl outline-none focus:border-red-500/50 placeholder-gray-600"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-900 to-red-600 rounded-xl shadow-md cursor-pointer hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Get Guide
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="py-24 bg-[var(--bg-card)] border-y border-[var(--border-color)] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Inquiry form column */}
          <div className="lg:col-span-7 bg-[var(--bg-primary)] border border-[var(--border-color)] p-6 rounded-2xl space-y-6 shadow-sm reveal-left">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Inbound Contact Request Form</h4>
              <p className="text-[10px] text-[var(--text-secondary)]">Submit lead inquiries to generate metadata files in the local vault.</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-gray-400 font-mono uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="hover-pop w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 font-mono uppercase mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="hover-pop w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 font-mono uppercase mb-1">Company Name (Optional)</label>
                <input
                  type="text"
                  value={contactCompany}
                  onChange={(e) => setContactCompany(e.target.value)}
                  className="hover-pop w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 font-mono uppercase mb-1">Inquiry Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="hover-pop w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500 resize-none"
                  placeholder="Specify system parameters or request a demo..."
                />
              </div>

              {submittedInquiry && (
                <div className="flex items-center gap-1.5 text-[10px] text-green-500 bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg font-mono">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  Inquiry logged. Contact file created.
                </div>
              )}

              <button
                type="submit"
                className="hover-pop w-full bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Send Request
              </button>
            </form>
          </div>

          {/* Inquiry log column */}
          <div className="lg:col-span-5 space-y-6 reveal-right">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Lead Telemetry Log</h4>
              <p className="text-[10px] text-[var(--text-secondary)]">Simulated B2B lead generation telemetry files stored in vault config.</p>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {inquiries.map((iq, idx) => (
                <div key={idx} className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between text-gray-500">
                    <span>{iq.name} ({iq.company})</span>
                    <span>{iq.timestamp}</span>
                  </div>
                  <div className="text-[var(--text-primary)] italic font-sans mt-1">"{iq.message}"</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* READY TO START CTA SECTION */}
      <section className="py-20 px-6 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-card)] relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10 reveal-on-scroll">
          <h3 className="text-2xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Ready to scale your technical team with absolute trust?
          </h3>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Deploy secure, sandboxed practical exams and keystroke telemetry auditing within 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="w-full sm:w-auto px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Schedule B2B Demo
            </button>
            <button
              type="button"
              onClick={() => window.location.href = "/careers"}
              className="w-full sm:w-auto px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 border border-[var(--border-color)] hover:border-red-500/30 rounded-xl text-[var(--text-primary)] transition-all cursor-pointer"
            >
              Explore Careers
            </button>
          </div>
        </div>
      </section>

      {/* ENHANCED FOOTER */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] pt-16 pb-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-[var(--border-color)] pb-12 mb-8">
          
          {/* Logo & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollToSection("home")}>
              <div className="bg-gradient-to-br from-blue-900 to-red-600 p-2 rounded-xl text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm tracking-widest text-[var(--text-primary)]">
                RECRUITAI <span className="text-red-500 font-normal">ENGINE</span>
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed max-w-sm">
              The high-performance proctoring and plagiarism auditing platform for tech recruiting. Protected under POSIX atomic lock protocols.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#home" 
                onClick={(e) => { e.preventDefault(); scrollToSection("home"); }} 
                className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-gray-500 hover:text-blue-400 hover:border-blue-500/40 transition-all"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a 
                href="#home" 
                onClick={(e) => { e.preventDefault(); scrollToSection("home"); }} 
                className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-gray-500 hover:text-white hover:border-white/40 transition-all"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a 
                href="#home" 
                onClick={(e) => { e.preventDefault(); scrollToSection("home"); }} 
                className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-gray-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Office Locations */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase tracking-wider">Office Locations</h5>
            <div className="space-y-3 font-mono text-[10px] text-[var(--text-secondary)]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Huddersfield, UK Office</span>
                  <span>Thornton Hills<br />Huddersfield, United Kingdom</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Islamabad, PK Office</span>
                  <span>Sector I-8<br />Islamabad, Pakistan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Sign Up */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase tracking-wider">Audit Newsletter</h5>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Subscribe to stay updated with sandbox virtualization releases and security whitepapers.
            </p>
            
            {newsletterSuccess ? (
              <div className="bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl text-[10px] text-green-400 font-mono">
                ✓ Registered successfully.
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
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[10px] text-[var(--text-primary)] px-3 py-2.5 rounded-xl outline-none focus:border-red-500/50 placeholder-gray-600"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-900 to-red-600 rounded-xl cursor-pointer hover:opacity-95 transition-all text-center"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} RecruitAI Corp. Protected under POSIX atomic lock protocols. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/careers" className="hover:text-[var(--text-primary)] transition-colors">Careers Page</a>
            <a href="/login" className="hover:text-[var(--text-primary)] transition-colors">Client Console</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
