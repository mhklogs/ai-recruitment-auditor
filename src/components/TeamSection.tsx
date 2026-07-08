import React, { useState, useEffect } from "react";
import { ExternalLink, Linkedin, Github, Mail, Briefcase, User, Shield, Star, Globe } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image_path: string;
  links: {
    linkedin?: string;
    github?: string;
    email?: string;
    portfolio?: string;
  };
  description?: string;
  isFounder?: boolean;
}

const teamMembers: TeamMember[] = [
  {
    name: "Hassaan Abdullah Kiyani",
    role: "Founder & CEO",
    image_path: "hassaan.png",
    links: {
      linkedin: "https://www.linkedin.com/in/hassaan-abdullah-kiyani",
      github: "https://github.com/hassaan-abdullah-kiyani", 
      email: "hasaanzia02@gmail.com"
    },
    isFounder: true,
    description: "Architect of the core audit engine and vision lead. Focused on security, performance, and integrity of AI screening protocols."
  },
  {
    name: "Khubaib Ul Hassan",
    role: "Co-Founder",
    image_path: "khubaib.png",
    links: {
      linkedin: "https://www.linkedin.com/in/khubaib-ul-hassan",
      portfolio: "https://khubaibulhassan.vercel.app"
    },
    isFounder: true,
    description: "Lead developer and design architect. Driving next-generation user experiences and advanced developer integrations."
  },
  {
    name: "Abdul Rafay",
    role: "Research & Development Lead",
    image_path: "placeholder.png",
    links: {
      linkedin: "https://www.linkedin.com/in/abdul-rafay-ar04",
      email: "rafaysh.04@gmail.com"
    },
    description: "Bachelor of Science in Computer Science from NUST (2023–2027). Formerly with Hack Club NUST, BAT, and NUST Entrepreneurs Club."
  }
];

interface StatData {
  label: string;
  value: number;
  suffix: string;
  decimals: number;
}

const stats: StatData[] = [
  { label: "Projects Delivered", value: 12500, suffix: "+", decimals: 0 },
  { label: "Client Satisfaction", value: 99.4, suffix: "%", decimals: 1 },
  { label: "Years Experience", value: 5, suffix: "+", decimals: 0 },
  { label: "Global Reach", value: 45, suffix: "+", decimals: 0 }
];

function AnimatedCounter({ value, duration = 1800, decimals = 0, suffix = "" }: { value: number; duration?: number; decimals?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = value;
    const startTime = performance.now();

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quad
      const easeProgress = progress * (2 - progress);
      const current = easeProgress * (end - start) + start;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [hasStarted, value, duration]);

  const formatNumber = (num: number) => {
    if (decimals === 0) {
      return Math.floor(num).toLocaleString();
    }
    return num.toFixed(decimals);
  };

  return (
    <span ref={setRef}>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

function TeamImage({ src, alt, isFounder }: { src: string; alt: string; isFounder?: boolean }) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const isPlaceholder = !src || src.includes("placeholder.png");

  if (imgError || isPlaceholder) {
    return (
      <div className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-[var(--border-color)] overflow-hidden relative group">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300 hover:border-red-500/30 group-hover:scale-105">
          <User className="w-10 h-10 text-slate-500 group-hover:text-red-400/80 transition-colors duration-300" />
          <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-1">{getInitials(alt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-color)] relative group">
      <img
        src={src}
        alt={alt}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale contrast-115 brightness-95"
      />
      {isFounder && (
        <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border border-red-500/30 shadow-lg tracking-wider flex items-center gap-1 uppercase">
          <Shield className="w-2.5 h-2.5" /> Founder
        </div>
      )}
    </div>
  );
}

export default function TeamSection() {
  return (
    <section id="team" className="py-24 px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Heading Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/5 border border-red-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase font-mono">Our Team</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Meet the Visionaries
          </h3>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto">
            The technical and creative minds building the future of autonomous, high-fidelity recruitment audits.
          </p>
        </div>

        {/* Counter Statistics Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto p-6 md:p-8 bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl relative overflow-hidden shadow-lg shadow-black/10 reveal-on-scroll">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2 py-4 flex flex-col justify-center items-center">
              <span className="text-3xl md:text-5xl font-black font-mono tracking-tighter bg-gradient-to-r from-red-500 via-rose-500 to-blue-500 text-transparent bg-clip-text">
                <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </span>
              <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-bold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Alternating Zig-Zag Profile List */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => {
            const isPlaceholder = !member.image_path || member.image_path === "placeholder.png";
            const imageSrc = isPlaceholder ? "" : `/assets/team/${member.image_path}`;
            const revealClass = index % 2 === 0 ? "reveal-left" : "reveal-right";

            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                } items-center md:items-stretch gap-6 md:gap-10 bg-[var(--bg-card)] border rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-300 relative overflow-hidden group hover:border-red-500/30 ${revealClass} ${
                  member.isFounder
                    ? "border-red-500/20 shadow-md shadow-red-950/5"
                    : "border-[var(--border-color)]"
                }`}
              >
                {/* Profile Image container - landscape (4:3) and compact layout */}
                <div className="w-full md:w-72 shrink-0 flex items-center justify-center">
                  <TeamImage 
                    src={imageSrc} 
                    alt={member.name} 
                    isFounder={member.isFounder} 
                  />
                </div>

                {/* Bio text block - flex-1 stretches across remaining row space */}
                <div className="flex-1 flex flex-col justify-between space-y-6 w-full">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h4 className={`text-xl font-bold tracking-wide transition-colors duration-300 group-hover:text-red-400 ${
                          member.isFounder ? "text-red-400" : "text-[var(--text-primary)]"
                        }`}>
                          {member.name}
                        </h4>
                        <p className="text-[10px] text-[var(--text-secondary)] font-mono flex items-center gap-1.5 mt-1">
                          <Briefcase className="w-3.5 h-3.5 opacity-80 text-red-500" />
                          {member.role}
                        </p>
                      </div>

                      {member.isFounder && (
                        <div className="z-10">
                          <span className="text-[8px] font-bold font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-current" /> Core
                          </span>
                        </div>
                      )}
                    </div>

                    {member.description && (
                      <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-red-500/20 pl-4 py-1">
                        "{member.description}"
                      </p>
                    )}
                  </div>

                  {/* Social links integrated clearly */}
                  <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-color)]">
                    {/* LinkedIn */}
                    {member.links.linkedin && (
                      <a
                        href={member.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-blue-500/50 hover:bg-blue-500/5 text-blue-400 hover:text-blue-300 transition-all duration-200"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}

                    {/* GitHub */}
                    {member.links.github && (
                      <a
                        href={member.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-slate-500/50 hover:bg-slate-500/5 text-slate-400 hover:text-slate-200 transition-all duration-200"
                        title="GitHub Profile"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}

                    {/* Portfolio Vercel Link for Co-Founder */}
                    {member.links.portfolio && (
                      <a
                        href={member.links.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                          member.role.includes("Co-Founder")
                            ? "bg-gradient-to-tr from-red-500/10 to-blue-500/10 border border-red-500/30 hover:border-red-500/60 hover:from-red-500/20 hover:to-blue-500/20 text-red-400 hover:text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                            : "bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-red-500/50 hover:bg-red-500/5 text-red-400 hover:text-red-300"
                        }`}
                        title="Developer Portfolio"
                      >
                        <Globe className="w-4 h-4" />
                        {member.role.includes("Co-Founder") && (
                          <span className="text-[8px] font-bold font-mono tracking-wider uppercase pr-0.5">Vercel Portfolio</span>
                        )}
                      </a>
                    )}

                    {/* Email Link */}
                    {member.links.email && (
                      <a
                        href={`mailto:${member.links.email}`}
                        className="p-2 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-400 hover:text-emerald-300 transition-all duration-200"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
