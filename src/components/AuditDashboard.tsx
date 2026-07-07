import React, { useState, useEffect } from "react";
import { AuditReport, CandidateScenario, BehavioralEvent } from "../types";
import { 
  Fingerprint, 
  Award, 
  Cpu, 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  UserCheck, 
  XCircle, 
  Clock, 
  HelpCircle,
  Brain,
  Printer,
  Compass
} from "lucide-react";

interface AuditDashboardProps {
  report: AuditReport | null;
  loading: boolean;
  onRunAudit: () => void;
  scenario: CandidateScenario;
}

export default function AuditDashboard({ report, loading, onRunAudit, scenario }: AuditDashboardProps) {
  const [loadingPhase, setLoadingPhase] = useState(0);
  const loadingPhases = [
    "Decrypting keystroke packet logs...",
    "Tracing window focus transitions and active browser tabs...",
    "Detecting bulk-paste clipboard intervals (threshold < 150ms)...",
    "Measuring candidate cognitive load and thinking intervals...",
    "Correlating paste logs with complexity of code block strings...",
    "Synthesizing defensible assessment recommendation..."
  ];

  // Rotate loading phases to keep the screen active and highly professional
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev + 1) % loadingPhases.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Color logic based on verdict
  const getVerdictTheme = (verdict: string) => {
    switch (verdict) {
      case "Failed Integrity Audit":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          accent: "text-red-500",
          ring: "ring-red-500/20",
          badge: "bg-red-500 text-[var(--text-primary)]",
          icon: <XCircle className="w-8 h-8 text-red-500" />
        };
      case "Review Recommended":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          text: "text-yellow-400",
          accent: "text-yellow-500",
          ring: "ring-yellow-500/20",
          badge: "bg-yellow-500 text-black",
          icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />
        };
      case "Clear":
      default:
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          text: "text-green-400",
          accent: "text-green-500",
          ring: "ring-green-500/20",
          badge: "bg-green-500 text-black",
          icon: <CheckCircle2 className="w-8 h-8 text-green-500" />
        };
    }
  };

  const getHiringDecisionTheme = (decision: string) => {
    switch (decision) {
      case "Strong Proceed":
        return { bg: "bg-green-500/15 text-green-400 border border-green-500/30", icon: <UserCheck className="w-5 h-5" /> };
      case "Proceed with Interview Focus":
        return { bg: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30", icon: <Compass className="w-5 h-5" /> };
      case "Reject":
      default:
        return { bg: "bg-red-500/15 text-red-400 border border-red-500/30", icon: <XCircle className="w-5 h-5" /> };
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "tab_switch":
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
      case "paste":
        return <FileText className="w-3.5 h-3.5 text-red-500" />;
      case "compile":
        return <Terminal className="w-3.5 h-3.5 text-blue-400" />;
      case "gaze_drift":
        return <Brain className="w-3.5 h-3.5 text-amber-400" />;
      case "keystroke_burst":
        return <Cpu className="w-3.5 h-3.5 text-green-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-[var(--text-secondary)]" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 overflow-y-auto flex flex-col shadow-2xl custom-scrollbar" id="audit-dashboard-card">
      {/* 1. Loading State */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6" id="dashboard-loading-view">
          <div className="relative w-24 h-24">
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 animate-ping"></div>
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-transparent animate-spin"></div>
            {/* Center radar scan icon */}
            <div className="absolute inset-3 bg-[var(--bg-card-hover)] rounded-full border border-[var(--border-color)] flex items-center justify-center shadow-inner">
              <Fingerprint className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-wider font-mono">
              AI AUDIT SYSTEM ENGAGED
            </h3>
            <p className="text-xs text-blue-500 h-8 font-mono animate-pulse">
              {loadingPhases[loadingPhase]}
            </p>
            <div className="w-48 h-1 bg-[var(--bg-card-hover)] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 w-1/2 rounded-full animate-[loading-bar_1.5s_infinite_linear]"></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Initial Empty State / Run Action */}
      {!loading && !report && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6" id="dashboard-empty-view">
          <div className="w-20 h-20 rounded-2xl bg-[var(--bg-card-hover)] border border-[var(--border-color)] flex items-center justify-center shadow-xl">
            <Fingerprint className="w-10 h-10 text-red-500" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
              Awaiting Audit Verdict
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Verify this candidate's genuine engineering competence against their behavioral telemetry. The AI auditor analyzes paste histories, focus anomalies, and cognitive loads.
            </p>
          </div>

          <button
            type="button"
            id="btn-run-audit"
            onClick={onRunAudit}
            className="flex items-center gap-2 bg-[#2188ff] hover:bg-[#1f75cb] text-[var(--text-primary)] font-semibold text-sm py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            Engage Chief AI Auditor
          </button>

          {/* Guidelines info */}
          <div className="w-full max-w-md pt-6 border-t border-[var(--border-color)] grid grid-cols-3 gap-4 text-left">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono">1. Integrity Check</div>
              <p className="text-[10px] text-[var(--text-secondary)] leading-normal">Correlates tab switches with instant pastes of complex classes.</p>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono">2. Capability Map</div>
              <p className="text-[10px] text-[var(--text-secondary)] leading-normal">Evaluates the depth of 'Why' and 'How' versus basic definitions.</p>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono">3. Cognitive Load</div>
              <p className="text-[10px] text-[var(--text-secondary)] leading-normal">Profiles thinking pauses, error iterations, and focus times.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Audited Report Results */}
      {!loading && report && report.audit_summary && report.hiring_recommendation && (() => {
        const theme = getVerdictTheme(report.audit_summary.verdict);
        const decisionTheme = getHiringDecisionTheme(report.hiring_recommendation.decision);

        return (
          <div className="space-y-6 print:p-0" id="dashboard-report-view">
            {/* Report Control Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[var(--border-color)] print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                  Official Defensible Record
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onRunAudit}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-hover)] text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--text-primary)] hover:border-gray-500 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Re-Audit
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg border border-[#2188ff]/30 bg-[#2188ff]/10 hover:bg-[#2188ff]/20 text-blue-500 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Print Header (Only visible on print) */}
            <div className="hidden print:block border-b border-gray-300 pb-4 mb-6">
              <h1 className="text-xl font-bold uppercase tracking-wider text-black font-mono">CHIEF AI RECRUITMENT AUDITOR CERTIFICATE</h1>
              <p className="text-xs text-gray-600 font-mono mt-1">Defensible Enterprise Hiring Committee Evidence</p>
            </div>

            {/* Candidate Audit Summary Banner */}
            <div className={`p-5 rounded-xl border ${theme.border} ${theme.bg} flex items-center justify-between gap-4`} id="audit-verdict-banner">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono">Candidate Audited</div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{scenario.name}</h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--text-primary)]">{scenario.role}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border-color)]"></span>
                  <span className="text-[var(--text-secondary)] font-mono text-[11px]">{scenario.seniority}</span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono">Auditor Final Verdict</div>
                <div className="flex items-center gap-2 mt-1">
                  {theme.icon}
                  <span className={`text-base font-bold uppercase font-mono tracking-wide ${theme.text}`}>
                    {report.audit_summary.verdict}
                  </span>
                </div>
              </div>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-2 gap-4" id="score-gauges-container">
              {/* Integrity Score */}
              <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 flex items-center gap-5 relative overflow-hidden">
                <div className="relative w-20 h-20">
                  {/* Circle outline background */}
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-[var(--border-color)]" strokeWidth="6" fill="transparent" />
                    <circle cx="40" cy="40" r="34" 
                      className={`transition-all duration-1000 ${
                        report.audit_summary.integrity_score > 75 
                          ? "stroke-green-500" 
                          : report.audit_summary.integrity_score > 40 
                          ? "stroke-yellow-500" 
                          : "stroke-red-500"
                      }`} 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * report.audit_summary.integrity_score) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-[var(--text-primary)] font-mono">{report.audit_summary.integrity_score}%</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-1">
                    Integrity Rating
                  </h4>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed mt-1">
                    Confidence level that the candidate typed code originally without instant copy-pastes of fully-crafted solutions.
                  </p>
                </div>
              </div>

              {/* Technical Score */}
              <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 flex items-center gap-5 relative overflow-hidden">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-[var(--border-color)]" strokeWidth="6" fill="transparent" />
                    <circle cx="40" cy="40" r="34" 
                      className="stroke-[#58a6ff] transition-all duration-1000" 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * report.audit_summary.technical_score) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-[var(--text-primary)] font-mono">{report.audit_summary.technical_score}%</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-1">
                    Technical Capability
                  </h4>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed mt-1">
                    Competence evaluation based on code design authority, explaining the "How" and "Why", and architectural maturity.
                  </p>
                </div>
              </div>
            </div>

            {/* Deep Analysis & Behavioral Profile */}
            <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 space-y-4" id="deep-analysis-card">
              <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono border-b border-[var(--border-color)] pb-2">
                Deep Analysis & Behavioral Profile
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-[var(--text-primary)] list-disc list-inside">
                    {report.deep_analysis.strengths.map((str, i) => (
                      <li key={i} className="leading-relaxed list-none pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-green-500">
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    Technical Gaps / Auditing Concerns
                  </span>
                  <ul className="space-y-1.5 text-xs text-[var(--text-primary)] list-disc list-inside">
                    {report.deep_analysis.weaknesses.map((weak, i) => (
                      <li key={i} className="leading-relaxed list-none pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-red-400">
                        {weak}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)]">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider font-mono flex items-center gap-1 mb-2">
                  <Brain className="w-3.5 h-3.5" />
                  Cognitive Load & Behavioral Profile Summary
                </span>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border-color)]">
                  {report.deep_analysis.behavioral_profile}
                </p>
              </div>
            </div>

            {/* Defensible Recommendation Panel */}
            <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 space-y-3" id="recommendation-card">
              <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono border-b border-[var(--border-color)] pb-2">
                Hiring Committee Actionable Recommendation
              </h3>

              <div className="flex items-center gap-3">
                <div className="text-xs text-[var(--text-secondary)] font-mono">Recommended Path:</div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase ${decisionTheme.bg}`}>
                  {decisionTheme.icon}
                  {report.hiring_recommendation.decision}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono">Evidence-Based Justification</div>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border-color)] whitespace-pre-line">
                  {report.hiring_recommendation.justification}
                </p>
              </div>
            </div>

            {/* Visual Telemetry Event Timeline Analysis */}
            <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-5 space-y-4" id="timeline-card">
              <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono border-b border-[var(--border-color)] pb-2">
                Reconstructed Behavioral Telemetry Timeline
              </h3>

              <div className="relative border-l-2 border-[var(--border-color)] ml-2 pl-4 py-2 space-y-4">
                {scenario.behavioralTelemetry.events.map((evt, idx) => (
                  <div key={idx} className="relative text-[11px]">
                    {/* Circle icon placement */}
                    <div className="absolute -left-[24px] top-0.5 bg-[var(--bg-card)] border border-[var(--border-color)] w-4 h-4 rounded-full flex items-center justify-center">
                      {getEventIcon(evt.event_type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-500">{evt.timestamp}</span>
                        <span className={`text-[9px] font-bold px-1 rounded uppercase ${
                          evt.event_type === 'tab_switch'
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : evt.event_type === 'paste'
                            ? "bg-purple-500/10 text-red-500 border border-purple-500/20"
                            : evt.event_type === 'compile'
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-gray-500/10 text-[var(--text-secondary)] border border-gray-500/20"
                        }`}>
                          {evt.event_type.replace('_', ' ')}
                        </span>
                        {evt.duration_sec && (
                          <span className="text-[var(--text-secondary)] text-[10px] font-mono">
                            duration: {evt.duration_sec}s
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--text-primary)] leading-relaxed">{evt.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Certificate Footer */}
            <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center text-[10px] text-[var(--text-secondary)] font-mono" id="audit-footer-stamps">
              <div>
                SYSTEM ID: <span className="text-[var(--text-secondary)]">AUDIT-3.5-EVAL-798</span>
              </div>
              <div className="text-right flex items-center gap-1.5 bg-[var(--bg-card-hover)] px-3 py-1 rounded border border-[var(--border-color)]">
                <Award className="w-3.5 h-3.5 text-red-500" />
                <span>CHIEF RECRUITMENT AUDITOR CERTIFIED</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
