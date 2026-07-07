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
  ChevronDown
} from "lucide-react";

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

  const handleContactSubmit = (e: React.FormEvent) => {
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
          <div className="inline-flex items-center gap-2 bg-[#be123c]/10 text-red-400 border border-[#be123c]/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-red-400" />
            Autonomous AI Human Resources Director v3.5
          </div>

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

      {/* OUR TEAM SECTION */}
      <section id="team" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 reveal-down">
            <h2 className="text-xs font-bold text-red-500 tracking-widest uppercase font-mono">Workspace Personnel Nodes</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Meet Our Premium AI Team</h3>
            <p className="text-xs text-[var(--text-secondary)]">A coordinated cluster of human handlers and high-performance neural drivers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="hover-pop bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-3 shadow-sm text-center reveal-left">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-900 to-indigo-900 mx-auto flex items-center justify-center text-white font-black text-lg">
                F
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">Founder & Principal Director</h4>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Primary System Coordinator</p>
              </div>
            </div>

            <div className="hover-pop bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-3 shadow-sm text-center reveal-down">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-900 to-rose-950 mx-auto flex items-center justify-center text-white font-black text-lg">
                CF
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">Co-Founder & Chief Operations</h4>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">SLA Monitoring Lead</p>
              </div>
            </div>

            <div className="hover-pop bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-3 shadow-sm text-center reveal-on-scroll">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-900 to-slate-900 mx-auto flex items-center justify-center text-white font-black text-lg">
                PH
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">Project Handlers</h4>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Workspace Integration Panel</p>
              </div>
            </div>

            <div className="hover-pop bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-3 shadow-sm text-center reveal-right">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-900 to-teal-950 mx-auto flex items-center justify-center text-white font-black text-lg animate-pulse">
                AI
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">AI Core Drivers</h4>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Gemini-3.5 High Performance Cluster</p>
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

      {/* CONTACT US SECTION */}
      <section id="contact" className="py-24 bg-[var(--bg-card)] border-t border-[var(--border-color)] px-6">
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

      {/* FOOTER */}
      <footer className="border-t border-[var(--border-color)] py-8 px-6 text-center text-[10px] text-[var(--text-secondary)] font-mono">
        © 2026 RecruitAI Corp. Protected under POSIX atomic lock protocols. All rights reserved.
      </footer>

    </div>
  );
}
