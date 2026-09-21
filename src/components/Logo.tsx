import React from "react";

/**
 * RecruitAuditor bespoke mark — a detected candidate's silhouette tracked inside
 * a radar/scope ring, with a live scan needle and a target blip on the ring.
 * Stroke-based, rounded caps, drawn in the product accent (#60A5FA).
 */

export function RecruitAuditorLogo({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ra-sweep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60A5FA" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2F6FEB" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="34" r="25" stroke="#60A5FA" strokeWidth="2.2" />
      <circle cx="32" cy="34" r="25" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="2 6" opacity="0.35" />
      <circle cx="32" cy="34" r="17" stroke="#60A5FA" strokeWidth="1" opacity="0.4" />
      <path d="M13 34h5M46 34h5M32 15v5M32 48v5" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <circle cx="27" cy="31" r="6" stroke="#60A5FA" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M14 47a13.5 13.5 0 0 1 26 0" stroke="#60A5FA" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M32 34l14-9" stroke="url(#ra-sweep)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <circle cx="49" cy="23" r="2.7" fill="#4DE3FF" />
      <path d="M49 23l7-4" stroke="#4DE3FF" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

export function RecruitAuditorWordmark({
  size = 30,
  className,
  light = false,
}: {
  size?: number;
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <RecruitAuditorLogo size={size} />
      <span
        className="font-display text-sm font-bold  tracking-[0.14em]"
        style={{ color: light ? "#F0F4FF" : "var(--text-primary)" }}
      >
        Recruit<span style={{ color: "#60A5FA" }}>Auditor</span>
      </span>
    </span>
  );
}