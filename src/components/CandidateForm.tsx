import React, { useState } from "react";
import { CandidateScenario, BehavioralEvent } from "../types";
import { SCENARIOS } from "../data";
import { Plus, Trash2, Code2, ShieldAlert, Cpu, Layers, Clipboard, Clock } from "lucide-react";

interface CandidateFormProps {
  scenario: CandidateScenario;
  onChange: (updated: CandidateScenario) => void;
}

export default function CandidateForm({ scenario, onChange }: CandidateFormProps) {
  const [activeTab, setActiveTab] = useState<'context' | 'exam' | 'telemetry'>('context');
  const [newEvent, setNewEvent] = useState<Partial<BehavioralEvent>>({
    timestamp: "00:05:00",
    event_type: "tab_switch",
    details: "Switched focus to an external resource",
    duration_sec: 30
  });

  const updateJobContext = (field: string, value: string) => {
    onChange({
      ...scenario,
      jobContext: {
        ...scenario.jobContext,
        [field]: value
      }
    });
  };

  const updateExamData = (field: string, value: any) => {
    onChange({
      ...scenario,
      examData: {
        ...scenario.examData,
        [field]: value
      }
    });
  };

  const updateTelemetry = (field: string, value: any) => {
    onChange({
      ...scenario,
      behavioralTelemetry: {
        ...scenario.behavioralTelemetry,
        [field]: value
      }
    });
  };

  const addEvent = () => {
    if (!newEvent.timestamp || !newEvent.details) return;
    
    const updatedEvents = [...scenario.behavioralTelemetry.events, newEvent as BehavioralEvent];
    // Sort events by timestamp
    updatedEvents.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    // Auto-update totals based on added event type
    let tabCount = scenario.behavioralTelemetry.tabSwitchesCount;
    let pasteCount = scenario.behavioralTelemetry.bulkPastesCount;
    if (newEvent.event_type === 'tab_switch') tabCount += 1;
    if (newEvent.event_type === 'paste') pasteCount += 1;

    onChange({
      ...scenario,
      behavioralTelemetry: {
        ...scenario.behavioralTelemetry,
        tabSwitchesCount: tabCount,
        bulkPastesCount: pasteCount,
        events: updatedEvents
      }
    });

    setNewEvent({
      timestamp: "00:05:00",
      event_type: "tab_switch",
      details: "Switched focus to an external resource",
      duration_sec: 30
    });
  };

  const removeEvent = (index: number) => {
    const eventToRemove = scenario.behavioralTelemetry.events[index];
    const updatedEvents = scenario.behavioralTelemetry.events.filter((_, i) => i !== index);

    let tabCount = scenario.behavioralTelemetry.tabSwitchesCount;
    let pasteCount = scenario.behavioralTelemetry.bulkPastesCount;
    if (eventToRemove.event_type === 'tab_switch') tabCount = Math.max(0, tabCount - 1);
    if (eventToRemove.event_type === 'paste') pasteCount = Math.max(0, pasteCount - 1);

    onChange({
      ...scenario,
      behavioralTelemetry: {
        ...scenario.behavioralTelemetry,
        tabSwitchesCount: tabCount,
        bulkPastesCount: pasteCount,
        events: updatedEvents
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl" id="candidate-form-card">

      {/* Panel Tab Navigation */}
      <div className="flex bg-[var(--bg-card-hover)] border-b border-[var(--border-color)] px-2 text-xs" id="editor-tabs-bar">
        <button
          id="tab-btn-context"
          onClick={() => setActiveTab('context')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 font-sans ${
            activeTab === 'context'
              ? "border-[#f78166] text-[var(--text-primary)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          1. Job Context
        </button>
        <button
          id="tab-btn-exam"
          onClick={() => setActiveTab('exam')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 font-sans ${
            activeTab === 'exam'
              ? "border-[#f78166] text-[var(--text-primary)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          2. Exam Submission
        </button>
        <button
          id="tab-btn-telemetry"
          onClick={() => setActiveTab('telemetry')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 font-sans ${
            activeTab === 'telemetry'
              ? "border-[#f78166] text-[var(--text-primary)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          3. Behavioral Telemetry
        </button>
      </div>

      {/* Editor Content Fields */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[var(--bg-card)] custom-scrollbar" id="editor-content-container">
        {activeTab === 'context' && (
          <div className="space-y-4" id="job-context-fields">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]  tracking-wider mb-1.5 font-mono">
                Candidate Name
              </label>
              <input
                id="input-candidate-name"
                type="text"
                value={scenario.name}
                onChange={(e) => onChange({ ...scenario, name: e.target.value })}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#388bfd]"
                placeholder="e.g., Jane Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]  tracking-wider mb-1.5 font-mono">
                Candidate Email
              </label>
              <input
                id="input-candidate-email"
                type="email"
                value={scenario.candidateEmail || ""}
                onChange={(e) => onChange({ ...scenario, candidateEmail: e.target.value })}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#388bfd]"
                placeholder="e.g., jane.doe@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]  tracking-wider mb-1.5 font-mono">
                Assessed Role Title
              </label>
              <input
                id="input-candidate-role"
                type="text"
                value={scenario.role}
                onChange={(e) => onChange({ ...scenario, role: e.target.value })}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#388bfd]"
                placeholder="e.g., Staff Go Architect"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]  tracking-wider mb-1.5 font-mono">
                Seniority Expectation
              </label>
              <input
                id="input-candidate-seniority"
                type="text"
                value={scenario.seniority}
                onChange={(e) => onChange({ ...scenario, seniority: e.target.value })}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#388bfd]"
                placeholder="e.g., Senior (L6 equivalent)"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]  tracking-wider font-mono">
                  Role Requirements & Context
                </label>
                <span className="text-[10px] text-blue-500 font-mono">Evaluates seniority alignment</span>
              </div>
              <textarea
                id="textarea-role-requirements"
                rows={4}
                value={scenario.jobContext.roleRequirements}
                onChange={(e) => updateJobContext("roleRequirements", e.target.value)}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg p-3 text-xs text-[var(--text-primary)] font-sans focus:outline-none focus:border-[#388bfd] leading-relaxed"
                placeholder="List key duties, cognitive demands, and output standards..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]  tracking-wider mb-1.5 font-mono">
                Target Technology Stack
              </label>
              <input
                id="input-tech-stack"
                type="text"
                value={scenario.jobContext.coreTechStack}
                onChange={(e) => updateJobContext("coreTechStack", e.target.value)}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#388bfd]"
                placeholder="e.g., Python, FastAPI, Asyncio, Redis"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]  tracking-wider mb-1.5 font-mono">
                Candidate Resume / Experience Text
              </label>
              <textarea
                id="textarea-candidate-resume"
                rows={8}
                value={scenario.resume || ""}
                onChange={(e) => onChange({ ...scenario, resume: e.target.value })}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg p-3 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#388bfd] leading-relaxed"
                placeholder="Paste raw resume or professional background..."
              />
            </div>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="space-y-4" id="exam-data-fields">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]  tracking-wider mb-1.5 font-mono">
                Exam Question Prompt
              </label>
              <textarea
                id="textarea-question-prompt"
                rows={3}
                value={scenario.examData.questionPrompt}
                onChange={(e) => updateExamData("questionPrompt", e.target.value)}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg p-3 text-xs text-[var(--text-primary)] font-sans focus:outline-none focus:border-[#388bfd] leading-relaxed"
                placeholder="Describe the technical question/test scenario..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]  tracking-wider font-mono">
                  Candidate Answer (Code & Reasoning)
                </label>
                <span className="text-[10px] text-red-400 font-mono">Analyzed for bulk-paste anomalies</span>
              </div>
              <textarea
                id="textarea-candidate-answer"
                rows={12}
                value={scenario.examData.candidateAnswer}
                onChange={(e) => updateExamData("candidateAnswer", e.target.value)}
                className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg p-3 text-xs text-green-400 font-mono focus:outline-none focus:border-[#388bfd] leading-relaxed"
                placeholder="Paste the candidate's raw submission (supporting code blocks, comments)..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)]  tracking-wider mb-1.5 font-mono">
                  Total Typing Time (Minutes)
                </label>
                <input
                  id="input-typing-duration"
                  type="number"
                  step="0.5"
                  value={scenario.examData.typingDurationMin}
                  onChange={(e) => updateExamData("typingDurationMin", parseFloat(e.target.value) || 0)}
                  className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#388bfd]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)]  tracking-wider mb-1.5 font-mono">
                  Complexity Level
                </label>
                <select
                  id="select-difficulty"
                  value={scenario.difficulty}
                  onChange={(e) => onChange({ ...scenario, difficulty: e.target.value })}
                  className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#388bfd]"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Extreme">Extreme</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="space-y-5" id="behavioral-telemetry-fields">
            {/* Critical Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-3 bg-[var(--bg-card-hover)] p-4 rounded-xl border border-[var(--border-color)]" id="telemetry-top-metrics">
              <div>
                <div className="text-[10px] font-mono text-[var(--text-secondary)] ">Tab Switches</div>
                <input
                  id="input-tab-switches"
                  type="number"
                  value={scenario.behavioralTelemetry.tabSwitchesCount}
                  onChange={(e) => updateTelemetry("tabSwitchesCount", parseInt(e.target.value) || 0)}
                  className="mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1 text-xs text-[var(--text-primary)] font-mono"
                />
              </div>
              <div>
                <div className="text-[10px] font-mono text-[var(--text-secondary)] ">Bulk Pastes</div>
                <input
                  id="input-bulk-pastes"
                  type="number"
                  value={scenario.behavioralTelemetry.bulkPastesCount}
                  onChange={(e) => updateTelemetry("bulkPastesCount", parseInt(e.target.value) || 0)}
                  className="mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1 text-xs text-[var(--text-primary)] font-mono"
                />
              </div>
              <div>
                <div className="text-[10px] font-mono text-[var(--text-secondary)] ">Typing Speed (WPM)</div>
                <input
                  id="input-typing-speed"
                  type="number"
                  value={scenario.behavioralTelemetry.averageTypingSpeedWpm}
                  onChange={(e) => updateTelemetry("averageTypingSpeedWpm", parseInt(e.target.value) || 0)}
                  className="mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1 text-xs text-[var(--text-primary)] font-mono"
                />
              </div>
            </div>

            {/* Event Timeline Editor */}
            <div>
              <h3 className="text-xs font-semibold text-[var(--text-primary)]  tracking-wider mb-3 font-mono">
                Dynamic Telemetry Event Log
              </h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-4 border border-[var(--border-color)] rounded-lg p-3 bg-[var(--bg-card)] custom-scrollbar" id="telemetry-events-list">
                {scenario.behavioralTelemetry.events.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] italic text-center py-4">No events in telemetry. Add some below.</p>
                ) : (
                  scenario.behavioralTelemetry.events.map((evt, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2 bg-[var(--bg-card-hover)] p-2.5 rounded border border-[var(--border-color)] group text-[11px]">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono bg-[var(--border-color)] text-[var(--text-primary)] px-1.5 py-0.5 rounded text-[9px] font-semibold">
                            {evt.timestamp}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold  ${
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
                          {evt.duration_sec !== undefined && (
                            <span className="text-[9px] text-[var(--text-secondary)] font-mono">
                              ({evt.duration_sec}s)
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--text-primary)] leading-normal truncate">{evt.details}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvent(idx)}
                        className="text-[var(--text-secondary)] hover:text-red-400 p-1 rounded hover:bg-[var(--border-color)] transition-colors cursor-pointer"
                        title="Delete telemetry event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Event Form */}
              <div className="bg-[var(--bg-card-hover)] p-4 rounded-xl border border-[var(--border-color)] space-y-3" id="add-telemetry-event-panel">
                <h4 className="text-[11px] font-bold text-[var(--text-secondary)]  font-mono tracking-wide">
                  Add New Telemetry Event
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-[var(--text-secondary)] font-mono">Timestamp</label>
                    <input
                      type="text"
                      value={newEvent.timestamp}
                      onChange={(e) => setNewEvent({ ...newEvent, timestamp: e.target.value })}
                      placeholder="00:05:00"
                      className="mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-secondary)] font-mono">Event Type</label>
                    <select
                      value={newEvent.event_type}
                      onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as any })}
                      className="mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1.5 text-xs text-[var(--text-primary)] font-sans"
                    >
                      <option value="tab_switch">Tab Switch</option>
                      <option value="paste">Instant Paste</option>
                      <option value="compile">Compile Run</option>
                      <option value="keystroke_burst">Typing Burst</option>
                      <option value="gaze_drift">Gaze Drift</option>
                      <option value="idle">Idle Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-secondary)] font-mono">Duration (sec)</label>
                    <input
                      type="number"
                      value={newEvent.duration_sec || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, duration_sec: parseInt(e.target.value) || undefined })}
                      placeholder="e.g. 15"
                      className="mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-secondary)] font-mono">Log Details / Description</label>
                  <input
                    type="text"
                    value={newEvent.details}
                    onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                    placeholder="Candidate pasted rate-limiting code class block..."
                    className="mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1.5 text-xs text-[var(--text-primary)] font-sans"
                  />
                </div>
                <button
                  type="button"
                  onClick={addEvent}
                  className="w-full flex justify-center items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-ink text-[var(--text-primary)] text-xs font-semibold py-2 px-3 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Inject Telemetry Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
