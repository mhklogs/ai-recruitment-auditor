import React, { useState, useEffect } from "react";
import { Linkedin, Github, Mail, User, Shield, Globe } from "lucide-react";

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
      <div className="w-full aspect-[4/3] flex items-center justify-center rounded-2xl border border-line bg-gradient-to-br from-[#131927] via-[#0A0D15] to-[#0D111C] overflow-hidden relative group">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#9BC4FF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="w-28 h-28 rounded-full border border-[#60A5FA]/20 bg-gradient-to-br from-[#131927] to-[#0A0D15] flex flex-col items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-[#60A5FA]/50">
          <User className="w-10 h-10 text-[var(--muted)] group-hover:text-[#60A5FA] transition-colors duration-300" />
          <span className="text-[9px] text-[var(--muted)] font-mono tracking-widest uppercase mt-1">{getInitials(alt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-line relative group">
      <img
        src={src}
        alt={alt}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale contrast-115 brightness-95"
      />
      {isFounder && (
        <div className="absolute top-3 left-3 bg-[#0D111C]/90 text-[#60A5FA] text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border border-[#60A5FA]/40 shadow-lg tracking-wider flex items-center gap-1 uppercase backdrop-blur-sm">
          <Shield className="w-2.5 h-2.5" /> Founder
        </div>
      )}
    </div>
  );
}

export default function TeamSection() {
  return (
    <section id="team" className="py-24 px-5 md:px-6 relative overflow-hidden bg-[#0A0D15]/60">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] bg-[#60A5FA]/5 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-[100px] bg-[#4DE3FF]/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-4 reveal-on-scroll">
          <div className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            <span className="pulse-dot flex h-2 w-2 rounded-full bg-[#60A5FA]" />
            Our team
          </div>
          <h3 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-[var(--text-primary)]">
            The minds behind the audit engine
          </h3>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto">
            The technical and creative minds building the future of autonomous, high-fidelity recruitment audits.
          </p>
        </div>

        {/* Counter Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto p-6 md:p-8 panel relative overflow-hidden reveal-on-scroll">
          <div className="accent-edge" />
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2 py-4 flex flex-col justify-center items-center">
              <span className="text-3xl md:text-5xl font-display font-bold tracking-tighter bg-gradient-to-r from-[#60A5FA] to-[#4DE3FF] text-transparent bg-clip-text">
                <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </span>
              <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-bold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Alternating Profile List */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => {
            const isPlaceholder = !member.image_path || member.image_path === "placeholder.png";
            const imageSrc = isPlaceholder ? "" : `/assets/team/${member.image_path}`;
            const revealClass = index % 2 === 0 ? "reveal-left" : "reveal-right";

            return (
              <div
                key={index}
                className={`panel p-6 md:p-8 flex flex-col md:flex-row ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                } items-center md:items-stretch gap-6 md:gap-10 transition-all duration-300 group ${
                  member.isFounder ? "hover:border-[#60A5FA]/40 shadow-[0_0_34px_-18px_rgba(96,165,250,0.5)]" : "hover:border-[#60A5FA]/25"
                } ${revealClass}`}
              >
                {/* Profile image */}
                <div className="w-full md:w-72 shrink-0 flex items-center justify-center">
                  <TeamImage
                    src={imageSrc}
                    alt={member.name}
                    isFounder={member.isFounder}
                  />
                </div>

                {/* Bio */}
                <div className="flex-1 flex flex-col justify-between space-y-6 w-full">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h4 className={`text-xl font-head font-bold tracking-wide transition-colors duration-300 ${
                          member.isFounder ? "text-[#60A5FA]" : "text-[var(--text-primary)] group-hover:text-[#60A5FA]"
                        }`}>
                          {member.name}
                        </h4>
                        <p className="text-[10px] text-[var(--text-secondary)] font-mono flex items-center gap-1.5 mt-1">
                          <Shield className="w-3.5 h-3.5 opacity-80 text-[#60A5FA]" />
                          {member.role}
                        </p>
                      </div>

                      {member.isFounder && (
                        <div className="z-10">
                          <span className="text-[8px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#60A5FA]/10 text-[#60A5FA] border border-[#60A5FA]/30 uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <Shield className="w-2.5 h-2.5 fill-current" /> Core
                          </span>
                        </div>
                      )}
                    </div>

                    {member.description && (
                      <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-[#60A5FA]/30 pl-4 py-1">
                        "{member.description}"
                      </p>
                    )}
                  </div>

                  {/* Social links */}
                  <div className="flex items-center gap-2 pt-4 border-t border-line">
                    {member.links.linkedin && (
                      <a
                        href={member.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg glass hover:border-[#60A5FA]/50 hover:bg-[#60A5FA]/5 text-[#60A5FA] hover:text-[#9BC4FF] transition-all duration-200"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}

                    {member.links.github && (
                      <a
                        href={member.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg glass hover:border-[#A6B1CC]/50 hover:bg-white/5 text-[var(--ink-soft)] hover:text-white transition-all duration-200"
                        title="GitHub Profile"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}

                    {member.links.portfolio && (
                      <a
                        href={member.links.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                          member.role.includes("Co-Founder")
                            ? "border border-[#60A5FA]/30 bg-[#60A5FA]/5 hover:border-[#60A5FA]/60 hover:bg-[#60A5FA]/10 text-[#60A5FA] hover:text-[#9BC4FF] shadow-[0_0_10px_rgba(96,165,250,0.15)]"
                            : "glass hover:border-[#60A5FA]/50 hover:bg-[#60A5FA]/5 text-[#60A5FA] hover:text-[#9BC4FF]"
                        }`}
                        title="Developer Portfolio"
                      >
                        <Globe className="w-4 h-4" />
                        {member.role.includes("Co-Founder") && (
                          <span className="text-[8px] font-bold font-mono tracking-wider uppercase pr-0.5">Vercel Portfolio</span>
                        )}
                      </a>
                    )}

                    {member.links.email && (
                      <a
                        href={`mailto:${member.links.email}`}
                        className="p-2 rounded-lg glass hover:border-[#4EF2BA]/50 hover:bg-[#4EF2BA]/5 text-[#4EF2BA] hover:text-[#9BF2D8] transition-all duration-200"
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