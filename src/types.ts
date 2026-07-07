export interface AuditSummary {
  integrity_score: number;
  technical_score: number;
  verdict: 'Clear' | 'Review Recommended' | 'Failed Integrity Audit';
}

export interface DeepAnalysis {
  strengths: string[];
  weaknesses: string[];
  behavioral_profile: string;
}

export interface HiringRecommendation {
  decision: 'Strong Proceed' | 'Proceed with Interview Focus' | 'Reject';
  justification: string;
}

export interface AuditReport {
  audit_summary: AuditSummary;
  deep_analysis: DeepAnalysis;
  hiring_recommendation: HiringRecommendation;
}

export interface BehavioralEvent {
  timestamp: string; // e.g. "00:02:15" (relative to test start)
  event_type: 'tab_switch' | 'paste' | 'keystroke_burst' | 'gaze_drift' | 'idle' | 'compile';
  details: string;
  duration_sec?: number;
}

export interface CandidateScenario {
  id: string;
  name: string;
  role: string;
  seniority: string;
  difficulty: string;
  expectedResult: string;
  jobContext: {
    roleRequirements: string;
    seniorityLevel: string;
    coreTechStack: string;
  };
  examData: {
    questionPrompt: string;
    candidateAnswer: string;
    typingDurationMin: number;
    incrementalAttempts: string[];
  };
  behavioralTelemetry: {
    tabSwitchesCount: number;
    bulkPastesCount: number;
    averageTypingSpeedWpm: number;
    events: BehavioralEvent[];
  };
  report?: AuditReport;
  resume?: string;
  candidateEmail?: string;
  screeningReport?: ScreeningReport;
}

export interface ScreeningReport {
  action: "SHORTLIST_RANK" | "EMAIL_DISPATCH";
  payload: {
    candidateId: string;
    meritScore: number;
    justification: string;
    anonymizedProfile: string;
    emailDraft: {
      to: string;
      subject: string;
      body: string;
    };
  };
}
