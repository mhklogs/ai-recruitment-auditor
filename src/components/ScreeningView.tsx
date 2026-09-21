import React from "react";
import { CandidateScenario, ScreeningReport } from "../types";
import { 
  Sparkles, 
  UserCheck, 
  Mail, 
  ShieldAlert, 
  FileText, 
  Award, 
  ChevronRight, 
  Cpu, 
  Lock,
  ArrowRight
} from "lucide-react";

interface ScreeningViewProps {
  scenario: CandidateScenario;
  loading: boolean;
  onRunScreening: () => void;
}

export default function ScreeningView({ scenario, loading, onRunScreening }: ScreeningViewProps) {
  const report = scenario.screeningReport;

  // Color configurations based on merit score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400 border-green-500/30 bg-green-500/10";
    if (score >= 60) return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
    return "text-red-400 border-red-500/30 bg-red-500/10";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-500 text-black";
    if (score >= 60) return "bg-yellow-500 text-black";
    return "bg-red-500 text-[var(--text-primary)]";
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--bg-card)] h-full flex flex-col" id="screening-view-container">
      {/* 1. Loading State */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6" id="screening-loading">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/10 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-pink-500 border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-3 bg-[var(--bg-card-hover)] rounded-full border border-[var(--border-color)] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2 max-w-sm">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] tracking-widest font-mono uppercase">
              RecruitAI Screen Engaged
            </h3>
            <p className="text-[11px] text-red-500 font-mono animate-pulse">
              Stripping demographics, verifying trajectory, and assessing skill depth...
            </p>
          </div>
        </div>
      )}

      {/* 2. Empty State / Run Screen Action */}
      {!loading && !report && (
        <div className="flex-1 flex flex-col gap-6" id="screening-empty-state">
          <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] p-4 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider block font-mono">RecruitAI Screening System</span>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This module strips bias-inducing parameters (names, location, age, gender) and conducts a merit-based evaluation of the candidate's career trajectory, project complexity, and growth.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Raw Resume Preview */}
            <div className="border border-[var(--border-color)] bg-[var(--bg-card-hover)]/30 rounded-xl p-4 flex flex-col overflow-hidden">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono mb-2.5 block border-b border-[var(--border-color)] pb-2">
                Raw Resume Ingested
              </span>
              <pre className="flex-1 text-[11px] font-mono text-[var(--text-primary)] overflow-y-auto whitespace-pre-wrap leading-relaxed pr-1 custom-scrollbar">
                {scenario.resume || "No resume content loaded. Add a resume profile in Configuration."}
              </pre>
            </div>

            {/* Assessment Launch Card */}
            <div className="border border-[var(--border-color)] bg-[var(--bg-card-hover)]/40 rounded-xl p-6 flex flex-col justify-center items-center text-center space-y-4">
              <Cpu className="w-10 h-10 text-red-500" />
              <div className="max-w-xs space-y-1">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Execute Merit-Based ATS Analysis</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-normal">
                  Send this candidate's resume and job requirements to the RecruitAI Engine for automatic anonymization, scoring, and engagement email drafting.
                </p>
              </div>

              <button
                type="button"
                onClick={onRunScreening}
                className="flex items-center gap-2 bg-gradient-to-r from-[#60A5FA] to-[#2F6FEB] text-white hover:opacity-90 text-[var(--text-primary)] font-semibold text-xs py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Screen Candidate Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Screening Report Output */}
      {!loading && report && (
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1" id="screening-report-content">
          
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-wider block">Merit Score</span>
                <span className={`text-xl font-mono font-bold mt-1 inline-block px-2.5 py-0.5 rounded-lg ${getScoreColor(report.payload.meritScore)}`}>
                  {report.payload.meritScore}%
                </span>
              </div>
              <Award className="w-5 h-5 text-red-500" />
            </div>

            <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] p-4 rounded-xl flex items-center justify-between col-span-2">
              <div>
                <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-wider block">RecruitAI Automatic Action</span>
                <span className={`text-xs font-mono font-bold mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full uppercase ${
                  report.action === "SHORTLIST_RANK"
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                }`}>
                  <UserCheck className="w-3.5 h-3.5" />
                  {report.action === "SHORTLIST_RANK" ? "Shortlist & Assessment Dispatch" : "Passive Talent Pool Re-route"}
                </span>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Anonymized Bias Mitigated Profile (5 cols) */}
            <div className="lg:col-span-5 border border-[var(--border-color)] bg-[var(--bg-card-hover)]/30 rounded-xl p-4 flex flex-col max-h-[380px]">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2 mb-3">
                <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-green-400" />
                  Anonymized Profile
                </span>
                <span className="text-[8px] bg-green-500/10 text-green-400 border border-green-500/20 px-1 rounded font-mono font-bold uppercase tracking-wider">
                  Bias Mitigated
                </span>
              </div>
              <pre className="flex-1 text-[10px] font-mono text-[var(--text-primary)] overflow-y-auto whitespace-pre-wrap leading-relaxed pr-1 custom-scrollbar">
                {report.payload.anonymizedProfile}
              </pre>
            </div>

            {/* Right: Justification and Outreach Email (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Merit Justification */}
              <div className="bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-xl p-4 space-y-2">
                <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider font-mono block">
                  Trajectory & merit assessment
                </span>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                  {report.payload.justification}
                </p>
              </div>

              {/* Outreach Email Draft */}
              <div className="bg-[var(--bg-card-hover)]/50 border border-[var(--border-color)] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    Automated Candidate Engagement
                  </span>
                  <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 rounded font-mono uppercase">
                    Ready to Dispatch
                  </span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="flex gap-2">
                    <span className="text-[var(--text-secondary)] w-12 flex-shrink-0">To:</span>
                    <span className="text-[var(--text-primary)]">{report.payload.emailDraft.to}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[var(--text-secondary)] w-12 flex-shrink-0">Subject:</span>
                    <span className="text-[var(--text-primary)]">{report.payload.emailDraft.subject}</span>
                  </div>
                  <div className="border-t border-[var(--border-color)] pt-2 mt-2">
                    <div className="text-[var(--text-primary)] leading-relaxed bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border-color)] whitespace-pre-line">
                      {report.payload.emailDraft.body}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1.5">
                  <button
                    onClick={() => alert("Simulated email dispatched successfully to: " + report.payload.emailDraft.to)}
                    className="flex items-center gap-1.5 bg-[var(--bg-primary)] hover:bg-[#2e3b4e] border border-[var(--border-color)] hover:border-gray-500 text-[var(--text-primary)] text-[10px] font-semibold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Dispatch Outreach</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Report Footer */}
          <div className="pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-[10px] text-[var(--text-secondary)] font-mono">
            <div>
              RecruitAI Pipeline: <span className="text-[var(--text-secondary)]">ATS-MERIT-VERIFY</span>
            </div>
            <button
              onClick={onRunScreening}
              className="text-red-500 hover:text-purple-300 font-semibold transition-all cursor-pointer"
            >
              Re-evaluate Merit Profile
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
