import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  Mic, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  FileText, 
  WifiOff, 
  Terminal, 
  Sparkles,
  Lock,
  Play,
  RotateCcw
} from "lucide-react";

export default function ProctoringPortal() {
  // Auth states
  const [companyId, setCompanyId] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [candidate, setCandidate] = useState<any>(null);

  // Exam states
  const [isExamActive, setIsExamActive] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNetworkReset, setIsNetworkReset] = useState(false);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [questionPrompt] = useState("Implement a thread-safe, high-concurrency rate limiter in TypeScript. Provide design justification for sliding-window log algorithms.");
  
  // Proctor telemetry logs
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [typingLogs, setTypingLogs] = useState<any[]>([]);
  const startTime = useRef<number>(0);

  // Anti-Cheat Listeners
  useEffect(() => {
    if (!isExamActive || isTerminated || isSubmitted || isNetworkReset) return;

    const handleWindowBlur = () => {
      setTabSwitches(prev => {
        const next = prev + 1;
        triggerFraudTermination(`Window Blur Alert - Focus lost. Switches count: ${next}`);
        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const next = prev + 1;
          triggerFraudTermination(`Visibility Change Alert - Tab hidden. Switches count: ${next}`);
          return next;
        });
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isExamActive, isTerminated, isSubmitted, isNetworkReset]);

  const triggerFraudTermination = async (details: string) => {
    setIsTerminated(true);
    try {
      const logs = [...typingLogs, { timestamp: new Date().toLocaleTimeString(), event_type: "tab_switch", details }];
      await fetch("/api/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          rollNumber,
          status: "TERMINATED_FRAUD",
          examData: {
            questionPrompt,
            candidateAnswer,
            typingDurationMin: Math.max(1, Math.round((Date.now() - startTime.current) / 60000))
          },
          telemetry: {
            tabSwitchesCount: tabSwitches + 1,
            bulkPastesCount: pasteCount,
            averageTypingSpeedWpm: 45,
            events: logs
          }
        })
      });
    } catch (e) {
      console.error("Failed to post fraud lock status", e);
    }
  };

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !rollNumber) return;
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch("/api/auth-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, rollNumber })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Authentication failed.");
      }

      const data = await response.json();
      setCandidate(data.metadata);
      setIsExamActive(true);
      startTime.current = Date.now();
      
      setTypingLogs([
        {
          timestamp: "00:00",
          event_type: "session_start",
          details: "Auth keys verified. Proctor nodes active."
        }
      ]);
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCandidateAnswer(e.target.value);
    if (Math.random() < 0.05) {
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      const newEvent = {
        timestamp: `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}`,
        event_type: "keystroke_burst",
        details: `Typing answer text. Current length: ${e.target.value.length} chars.`,
        duration_sec: Math.floor(Math.random() * 5) + 1
      };
      setTypingLogs(prev => [...prev, newEvent]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    setPasteCount(prev => prev + 1);
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    const newEvent = {
      timestamp: `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}`,
      event_type: "bulk_paste",
      details: "Copied code pasted into editor buffer.",
      duration_sec: 1
    };
    setTypingLogs(prev => [...prev, newEvent]);
  };

  const handleSimulateNetworkLoss = async () => {
    setIsNetworkReset(true);
    try {
      await fetch("/api/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          rollNumber,
          status: "NETWORK_RESET",
          examData: {
            questionPrompt,
            candidateAnswer,
            typingDurationMin: Math.max(1, Math.round((Date.now() - startTime.current) / 60000))
          },
          telemetry: {
            tabSwitchesCount: tabSwitches,
            bulkPastesCount: pasteCount,
            averageTypingSpeedWpm: 52,
            events: [...typingLogs, { timestamp: "Network Loss", event_type: "network_loss", details: "Local proctor connectivity dropped." }]
          }
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitExam = async () => {
    if (!window.confirm("Are you sure you want to submit your final assessment answers? This action locks the workspace link permanently.")) return;
    setIsSubmitted(true);

    try {
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      const logs = [...typingLogs, { timestamp: "Submission", event_type: "session_close", details: "Exam completed by candidate." }];
      
      const response = await fetch("/api/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          rollNumber,
          status: "TEST_SUBMITTED",
          examData: {
            questionPrompt,
            candidateAnswer,
            typingDurationMin: Math.max(1, Math.round((Date.now() - startTime.current) / 60000))
          },
          telemetry: {
            tabSwitchesCount: tabSwitches,
            bulkPastesCount: pasteCount,
            averageTypingSpeedWpm: 58,
            events: logs
          }
        })
      });

      if (!response.ok) throw new Error("Failed to submit test.");
    } catch (e) {
      alert("Error submitting exam: " + e);
    }
  };

  const handleResetAuth = () => {
    setCompanyId("");
    setRollNumber("");
    setCandidate(null);
    setIsExamActive(false);
    setIsTerminated(false);
    setIsSubmitted(false);
    setIsNetworkReset(false);
    setCandidateAnswer("");
    setTabSwitches(0);
    setPasteCount(0);
    setTypingLogs([]);
    setAuthError(null);
  };

  // Auth Screen layout (unifying theme)
  if (!isExamActive) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-primary)]">
        <div className="hover-pop w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-5 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 to-red-600"></div>

          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center bg-[var(--bg-primary)] p-2.5 border border-[var(--border-color)] text-red-500 rounded-xl mb-1 shadow">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-base font-bold text-[var(--text-primary)] uppercase tracking-wider">Candidate Proctor Portal</h1>
            <p className="text-xs text-[var(--text-secondary)]">Initialize secure visual & keystroke-audited test session</p>
          </div>

          <form onSubmit={handleStartExam} className="space-y-4">
            <div>
              <label className="block text-[9px] text-[var(--text-secondary)] font-semibold mb-1 uppercase font-mono">B2B Company ID</label>
              <input
                type="text"
                placeholder="e.g. client-techcorp"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="hover-pop w-full bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-red-500 text-[var(--text-primary)] text-xs px-3.5 py-2.5 rounded-lg outline-none font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] text-[var(--text-secondary)] font-semibold mb-1 uppercase font-mono">Joint Roll Number</label>
              <input
                type="text"
                placeholder="e.g. BATCH26-TEC-A3F9"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="hover-pop w-full bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-red-500 text-[var(--text-primary)] text-xs px-3.5 py-2.5 rounded-lg outline-none font-mono"
                required
              />
            </div>

            {authError && (
              <div className="bg-red-950/10 border border-red-800/25 text-red-400 p-3 rounded-lg text-xs flex items-start gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="hover-pop w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-2.5 px-4 rounded-lg cursor-pointer shadow"
            >
              <Play className="w-3.5 h-3.5" />
              {authLoading ? "Verifying Credentials..." : "Authenticate & Start Test"}
            </button>
          </form>

          <div className="text-[9px] text-[var(--text-secondary)] font-mono text-center border-t border-[var(--border-color)] pt-3.5">
            🔑 Security Note: Switching windows, resizing screens, or copy-pasting unauthorized contents terminates the test.
          </div>
        </div>
      </div>
    );
  }

  // Terminated fraud screen
  if (isTerminated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-primary)]">
        <div className="hover-pop w-full max-w-md bg-[var(--bg-card)] border border-red-800/20 rounded-2xl p-6 text-center space-y-4 shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
          <div className="inline-flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-xl animate-bounce">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-sm font-bold text-red-500 uppercase tracking-widest">EXAM WORKSPACE TERMINATED</h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
            PROCTOR ACTION: Flagged as "TERMINATED_FRAUD". An unauthorized window focus loss (tab switch or blur event) was recorded. This assessment link has been permanently locked.
          </p>
          <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)] text-left text-[10px] text-[var(--text-secondary)] space-y-1 font-mono">
            <div>Roll Number: {rollNumber}</div>
            <div>Alert: Window focus blurs detected ({tabSwitches})</div>
            <div>Time Block: Session locked permanently</div>
          </div>
          <button
            onClick={handleResetAuth}
            className="hover-pop flex items-center gap-1 mx-auto bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] py-1.5 px-3 rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Submitted successfully screen
  if (isSubmitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-primary)]">
        <div className="hover-pop w-full max-w-md bg-[var(--bg-card)] border border-green-800/20 rounded-2xl p-6 text-center space-y-4 shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>
          <div className="inline-flex items-center justify-center bg-green-500/10 text-green-500 border border-green-500/20 p-3 rounded-xl animate-pulse">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h1 className="text-sm font-bold text-green-500 uppercase tracking-wider">ASSESSMENT COMPLETE</h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-mono">
            PROTOCOL 3: Submission logged as "TEST_SUBMITTED". Your technical scoring profiles, behavioral telemetry logs, and psycho-leadership metrics are currently compiling.
          </p>
          <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] text-left text-[11px] text-[var(--text-secondary)] space-y-1 font-mono">
            <div>⚙️ System Status: Running VibeAudit Code Audit</div>
            <div>⏱️ Result Release Scheduled: Exactly 4 hours from now</div>
            <div className="text-gray-500 mt-2">At the 4-hour mark, a result dispatch email will be sent back to your address.</div>
          </div>
          <button
            onClick={handleResetAuth}
            className="hover-pop flex items-center gap-1 mx-auto bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] py-1.5 px-3 rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Simulated Network Loss screen
  if (isNetworkReset) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-primary)]">
        <div className="hover-pop w-full max-w-md bg-[var(--bg-card)] border border-yellow-850/20 rounded-2xl p-6 text-center space-y-4 shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500"></div>
          <div className="inline-flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 p-3 rounded-xl animate-pulse">
            <WifiOff className="w-6 h-6" />
          </div>
          <h1 className="text-sm font-bold text-yellow-500 uppercase tracking-wider">CONNECTION DISRUPTED</h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-mono">
            STATE STATUS: "NETWORK_RESET". Telemetry sync dropped. The Proctor Engine has locked active answers in the local buffer and scheduled automated retry synchronizations.
          </p>
          <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] text-left text-[11px] text-[var(--text-secondary)] space-y-1 font-mono">
            <div>📡 Connection status: Re-establishing sync channel</div>
            <div>🛡️ Security Lock: Typing buffered locally</div>
          </div>
          <button
            onClick={handleResetAuth}
            className="hover-pop w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer"
          >
            Reconnect Proctor Node
          </button>
        </div>
      </div>
    );
  }

  // Live Exam Workspace (Unifying layouts)
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      
      {/* LEFT PANEL: Coding editor (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Exam Header */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Secure Assessment Workspace</h1>
            <div className="text-[10px] text-[var(--text-secondary)] font-mono mt-1">
              Roll No: <span className="text-red-500 font-semibold">{rollNumber}</span> | Client: <span className="text-blue-500 font-semibold">{companyId}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateNetworkLoss}
              className="hover-pop flex items-center gap-1.5 bg-[var(--bg-primary)] hover:bg-yellow-500/5 border border-[var(--border-color)] hover:border-yellow-500 text-[var(--text-secondary)] hover:text-yellow-500 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
            >
              <WifiOff className="w-3.5 h-3.5" />
              Simulate Net Loss
            </button>
            <button
              onClick={handleSubmitExam}
              className="hover-pop flex items-center gap-1.5 bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-colors cursor-pointer shadow"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Question Panel */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg space-y-2">
          <div className="text-[9px] font-bold text-[var(--text-secondary)] font-mono uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-red-500" />
            Technical Exam Question Prompt
          </div>
          <p className="text-xs text-[var(--text-primary)] leading-relaxed font-semibold">
            {questionPrompt}
          </p>
        </div>

        {/* Answer Code Area */}
        <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-lg min-h-[300px]">
          <div className="bg-[var(--bg-primary)] px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center text-[9px] font-mono text-[var(--text-secondary)]">
            <span>ANSWER_WORKSPACE.ts</span>
            <span>UTF-8 | TypeScript</span>
          </div>
          <textarea
            value={candidateAnswer}
            onChange={handleTyping}
            onPaste={handlePaste}
            placeholder="Type your technical solution here..."
            className="flex-1 p-4 bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-mono outline-none resize-none border-none leading-relaxed"
          />
        </div>

      </div>

      {/* RIGHT PANEL: Live proctor telemetry (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Live Proctor Video/Mic feeds */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-[9px] font-bold text-[var(--text-secondary)] font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--border-color)] pb-2.5">
            <Camera className="w-3.5 h-3.5 text-red-500" />
            AI Proctoring Feed Telemetry
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 flex flex-col items-center justify-center gap-2 relative aspect-video overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[8px] font-mono text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                Webcam Auditing
              </div>
              <Camera className="w-6 h-6 text-gray-500 mt-2" />
              <span className="text-[9px] text-[var(--text-secondary)] font-mono">Simulated Feed Ok</span>
            </div>

            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 flex flex-col items-center justify-center gap-2 relative aspect-video overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[8px] font-mono text-blue-500 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                Mic Auditing
              </div>
              <Mic className="w-6 h-6 text-gray-500 mt-2" />
              <span className="text-[9px] text-[var(--text-secondary)] font-mono">Telemetry Active</span>
            </div>
          </div>
        </div>

        {/* Live Keystroke timeline terminal */}
        <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg flex flex-col overflow-hidden min-h-[250px]">
          <h2 className="text-[9px] font-bold text-[var(--text-secondary)] font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--border-color)] pb-2.5">
            <Terminal className="w-3.5 h-3.5 text-red-500" />
            Keystroke Telemetry Logger
          </h2>
          
          <div className="flex-1 overflow-y-auto font-mono text-[9px] mt-3 space-y-2.5 pr-1 text-[var(--text-secondary)]">
            {typingLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-500">[{log.timestamp}]</span>
                <div>
                  <span className="text-red-500 font-bold uppercase">[{log.event_type}]</span>{" "}
                  <span className="text-[var(--text-primary)]">{log.details}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--border-color)] pt-3.5 mt-3 grid grid-cols-2 gap-2 text-center text-[9px] font-mono">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-2 rounded-lg">
              <div className="text-[var(--text-secondary)] uppercase">Focus Losses</div>
              <div className={`text-xs font-bold mt-0.5 ${tabSwitches > 0 ? "text-red-500" : "text-[var(--text-primary)]"}`}>
                {tabSwitches} blurs
              </div>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-2 rounded-lg">
              <div className="text-[var(--text-secondary)] uppercase">Bulk Pastes</div>
              <div className={`text-xs font-bold mt-0.5 ${pasteCount > 0 ? "text-red-500" : "text-[var(--text-primary)]"}`}>
                {pasteCount} times
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
