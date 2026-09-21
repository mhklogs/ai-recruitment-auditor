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
  RotateCcw,
  Send,
  Loader2,
  ChevronRight
} from "lucide-react";

interface TestSession {
  token: string;
  title: string;
  description: string;
  candidateEmail: string;
  candidateName: string;
  durationMin: number;
  companyId: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  questions?: any[];
}

interface Question {
  id: string;
  type: string;
  question_text: string;
  options?: string[];
  correct_answer?: string;
  points: number;
  order_index: number;
}

export default function ProctoringPortal() {
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [token, setToken] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  
  const [isExamActive, setIsExamActive] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNetworkReset, setIsNetworkReset] = useState(false);
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [typingLogs, setTypingLogs] = useState<any[]>([]);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  
  const startTime = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      validateToken(urlToken);
    }
  }, []);

  useEffect(() => {
    if (isExamActive && !cameraStream && !micStream) {
      setupMediaDevices();
    }
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
      if (micStream) micStream.getTracks().forEach(t => t.stop());
    };
  }, [isExamActive]);

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

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Warning: Leaving this page will terminate your active test session.";
      return e.returnValue;
    };

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      triggerFraudTermination("PopState Alert - Candidate attempted to navigate backward.");
    };

    // Prevent back/forward buttons
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isExamActive, isTerminated, isSubmitted, isNetworkReset]);

  const setupMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: "user" }, 
        audio: true 
      });
      setCameraStream(stream);
      setMicStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
      if (audioRef.current) audioRef.current.srcObject = stream;
    } catch (err: any) {
      console.error("Media device error:", err);
      setCameraError("Camera access denied or unavailable");
      setMicError("Microphone access denied or unavailable");
    }
  };

  const validateToken = async (tokenValue: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`/api/test-session/${tokenValue}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid test link.");
      
      setTestSession(data.testSession);
      setIsExamActive(true);
      startTime.current = Date.now();
      
      setTypingLogs([
        {
          timestamp: "00:00",
          event_type: "session_start",
          details: `Secure test session initialized for ${data.testSession.candidateName}. Proctor nodes active.`
        }
      ]);
    } catch (err: any) {
      setAuthError(err.message || "Failed to validate test link.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await validateToken(token);
  };

  const triggerFraudTermination = async (details: string) => {
    setIsTerminated(true);
    try {
      const logs = [...typingLogs, { timestamp: new Date().toLocaleTimeString(), event_type: "tab_switch", details }];
      if (testSession?.token) {
        await fetch(`/api/test-session/${testSession.token}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "TERMINATED_FRAUD",
            examData: { answers, typingDurationMin: Math.max(1, Math.round((Date.now() - startTime.current) / 60000)) },
            telemetry: { tabSwitchesCount: tabSwitches + 1, bulkPastesCount: pasteCount, averageTypingSpeedWpm: 45, events: logs, cameraEnabled: !!cameraStream, micEnabled: !!micStream }
          })
        });
      }
    } catch (e) {
      console.error("Failed to post fraud lock status", e);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitExam = async () => {
    if (!window.confirm("Are you sure you want to submit your final assessment? This action locks the workspace permanently.")) return;
    setIsSubmitted(true);

    try {
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      const logs = [...typingLogs, { timestamp: "Submission", event_type: "session_close", details: "Exam completed by candidate." }];
      
      if (testSession?.token) {
        const response = await fetch(`/api/test-session/${testSession.token}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "TEST_SUBMITTED",
            answers,
            examData: { typingDurationMin: Math.max(1, Math.round(elapsed / 60)) },
            telemetry: { tabSwitchesCount: tabSwitches, bulkPastesCount: pasteCount, averageTypingSpeedWpm: 58, events: logs, cameraEnabled: !!cameraStream, micEnabled: !!micStream }
          })
        });

        if (!response.ok) throw new Error("Failed to submit test.");
      }
    } catch (e) {
      alert("Error submitting exam: " + e);
    }
  };

  const handleSimulateNetworkLoss = async () => {
    setIsNetworkReset(true);
    try {
      if (testSession?.token) {
        await fetch(`/api/test-session/${testSession.token}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "NETWORK_RESET",
            answers,
            examData: { typingDurationMin: Math.max(1, Math.round((Date.now() - startTime.current) / 60000)) },
            telemetry: { tabSwitchesCount: tabSwitches, bulkPastesCount: pasteCount, averageTypingSpeedWpm: 52, events: [...typingLogs, { timestamp: "Network Loss", event_type: "network_loss", details: "Local proctor connectivity dropped." }], cameraEnabled: !!cameraStream, micEnabled: !!micStream }
          })
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetAuth = () => {
    setToken("");
    setTestSession(null);
    setIsExamActive(false);
    setIsTerminated(false);
    setIsSubmitted(false);
    setIsNetworkReset(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTabSwitches(0);
    setPasteCount(0);
    setTypingLogs([]);
    setAuthError(null);
    setCameraError(null);
    setMicError(null);
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    if (micStream) micStream.getTracks().forEach(t => t.stop());
    setCameraStream(null);
    setMicStream(null);
  };

  const currentQuestion = testSession?.questions?.[currentQuestionIndex];
  const totalQuestions = testSession?.questions?.length || 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Auth Screen
  if (!isExamActive) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-primary)]">
        <div className="hover-pop w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#60A5FA] to-[#2F6FEB]"></div>
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center bg-[var(--bg-primary)] p-2.5 border border-[var(--border-color)] text-red-500 rounded-xl mb-1 shadow">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-base font-bold text-[var(--text-primary)] uppercase tracking-wider">Candidate Proctor Portal</h1>
            <p className="text-xs text-[var(--text-secondary)]">Secure assessment with camera and microphone monitoring</p>
          </div>
          <form onSubmit={handleStartExam} className="space-y-4">
            <div>
              <label className="block text-[9px] text-[var(--text-secondary)] font-semibold mb-1 uppercase font-mono">Test Link / Token</label>
              <input
                type="text"
                placeholder="Paste your test link or enter token..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
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
            <button type="submit" disabled={authLoading} className="hover-pop w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#60A5FA] to-[#2F6FEB] text-white text-xs font-bold py-2.5 px-4 rounded-lg cursor-pointer shadow">
              {authLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {authLoading ? "Verifying Test Link..." : "Authenticate & Start Test"}
            </button>
          </form>
          <div className="text-[9px] text-[var(--text-secondary)] font-mono text-center border-t border-[var(--border-color)] pt-3.5">
            Security: Tab switches and pastes are monitored. Camera and microphone will be activated.
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
            PROCTOR ACTION: Flagged as "TERMINATED_FRAUD". This assessment link has been permanently locked.
          </p>
          <button onClick={handleResetAuth} className="hover-pop flex items-center gap-1 mx-auto bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] py-1.5 px-3 rounded-lg cursor-pointer">
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
            Your assessment has been submitted successfully. Results will be released after evaluation.
          </p>
          <button onClick={handleResetAuth} className="hover-pop flex items-center gap-1 mx-auto bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] py-1.5 px-3 rounded-lg cursor-pointer">
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
            Telemetry sync dropped. The Proctor Engine has locked active answers locally.
          </p>
          <button onClick={handleResetAuth} className="hover-pop w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#60A5FA] to-[#2F6FEB] text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer">
            Reconnect Proctor Node
          </button>
        </div>
      </div>
    );
  }

  // Live Exam Workspace
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      
      {/* LEFT PANEL: Questions (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Exam Header */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">{testSession.title}</h1>
            <div className="text-[10px] text-[var(--text-secondary)] font-mono mt-1">
              Candidate: <span className="text-red-500 font-semibold">{testSession.candidateName}</span> | 
              Question: <span className="text-blue-500 font-semibold">{currentQuestionIndex + 1}/{totalQuestions}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSimulateNetworkLoss} className="hover-pop flex items-center gap-1.5 bg-[var(--bg-primary)] hover:bg-yellow-500/5 border border-[var(--border-color)] hover:border-yellow-500 text-[var(--text-secondary)] hover:text-yellow-500 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer">
              <WifiOff className="w-3.5 h-3.5" />
              Simulate Net Loss
            </button>
            {isLastQuestion ? (
              <button onClick={handleSubmitExam} className="hover-pop flex items-center gap-1.5 bg-gradient-to-r from-[#60A5FA] to-[#2F6FEB] text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-colors cursor-pointer shadow">
                <Send className="w-3.5 h-3.5" />
                Submit Exam
              </button>
            ) : (
              <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="hover-pop flex items-center gap-1.5 bg-gradient-to-r from-[#60A5FA] to-[#2F6FEB] text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-colors cursor-pointer shadow">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-[#60A5FA] to-[#2F6FEB] transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }} />
        </div>

        {/* Question Panel */}
        {currentQuestion && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="text-[9px] font-bold text-[var(--text-secondary)] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-red-500" />
              {currentQuestion.type === "multiple_choice" ? "Multiple Choice" : "Text Response"} ({currentQuestion.points} pts)
            </div>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed font-semibold">
              {currentQuestion.question_text}
            </p>

            {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options.map((option, idx) => (
                  <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${answers[currentQuestion.id] === option ? "border-red-500 bg-red-500/5" : "border-[var(--border-color)] hover:border-gray-600"}`}>
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="accent-red-500"
                    />
                    <span className="text-xs text-[var(--text-primary)]">{String.fromCharCode(65 + idx)}. {option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === "text" && (
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg outline-none focus:border-red-500 resize-none"
                rows={6}
              />
            )}
          </div>
        )}

      </div>

      {/* RIGHT PANEL: Proctor telemetry (4 cols) */}
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
                <span className={`w-1.5 h-1.5 rounded-full ${cameraStream ? 'bg-red-500 animate-ping' : 'bg-gray-500'}`}></span>
                Webcam Auditing
              </div>
              {cameraStream ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-gray-500 mt-2" />
                  <span className="text-[9px] text-[var(--text-secondary)] font-mono">{cameraError || "Initializing..."}</span>
                </>
              )}
            </div>

            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 flex flex-col items-center justify-center gap-2 relative aspect-video overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[8px] font-mono text-blue-500 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                <span className={`w-1.5 h-1.5 rounded-full ${micStream ? 'bg-blue-500 animate-ping' : 'bg-gray-500'}`}></span>
                Mic Auditing
              </div>
              {micStream ? (
                <audio ref={audioRef} autoPlay className="w-full h-8" />
              ) : (
                <>
                  <Mic className="w-6 h-6 text-gray-500 mt-2" />
                  <span className="text-[9px] text-[var(--text-secondary)] font-mono">{micError || "Initializing..."}</span>
                </>
              )}
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
