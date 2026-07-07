import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

dotenv.config();

if (!globalThis.WebSocket && WebSocket) {
  (globalThis as any).WebSocket = WebSocket;
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const APP_MODE = process.env.APP_MODE || (PORT === 3001 ? "testing" : "recruiter");

app.use(express.json());

// Supabase service role client for server-side operations
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
let supabase: any = null;
try {
  if (supabaseUrl && supabaseUrl.startsWith("http") && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
} catch (e) {
  console.warn("[Supabase] Service client init failed:", e);
}

app.get("/api/system-config", (req, res) => {
  res.json({ mode: APP_MODE });
});

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper function to execute the primary candidate code & telemetry audit
async function executeCandidateAudit(jobContext: any, examData: any, behavioralTelemetry: any): Promise<any> {
  const prompt = `
# ROLE
You are the "Chief AI Recruitment Auditor" for a premium enterprise hiring platform. Your output is final, objective, and defensible to a hiring committee. You prioritize competence, behavioral integrity, and systemic problem-solving over memorized theory.

# CONTEXT
1. JOB_CONTEXT:
${typeof jobContext === 'string' ? jobContext : JSON.stringify(jobContext, null, 2)}

2. EXAM_DATA:
${typeof examData === 'string' ? examData : JSON.stringify(examData, null, 2)}

3. BEHAVIORAL_TELEMETRY:
${typeof behavioralTelemetry === 'string' ? behavioralTelemetry : JSON.stringify(behavioralTelemetry, null, 2)}

# MISSION
Evaluate the candidate based on "Authentic Capability." If the integrity score is low, the technical quality is irrelevant—the verdict must prioritize the Integrity Risk.

# EVALUATION RULES (Apply in order)
1. INTEGRITY AUDIT: 
   - Analyze [BEHAVIORAL_TELEMETRY] for "Tab-Switching" or "Instant Bulk Pastes" or other suspicious indicators.
   - Cross-reference these with [EXAM_DATA]. If a "Tab-Switch" or copy action immediately precedes a complex code block that appears instantly (humanly impossible to type in < 2 seconds), you MUST set audit_summary.integrity_score to less than 20% and set audit_summary.verdict to "Failed Integrity Audit".
   - If there are tab-switches and bulk pastes but it is less direct or involves template files, or shows moderate copy-pasting of boilerplate, set audit_summary.verdict to "Review Recommended" and integrity_score between 20% and 70%.
   - If telemetry shows clean, natural typing paces and zero tab-switches or unexplained bulk pastes, set audit_summary.verdict to "Clear" and integrity_score between 80% and 100%.

2. TECHNICAL COMPETENCY:
   - Does the solution address the "Why" and "How," or just the "What"? Does the candidate actually demonstrate knowledge or just paste syntactic definitions?
   - Flag "Hallucination Patterns": Does the candidate use industry buzzwords incorrectly or over-complicate simple tasks to sound senior?
   - Score from 0 to 100 based on technical soundness and alignment to the seniority specified in the JOB_CONTEXT.

3. COGNITIVE LOAD & PERSISTENCE:
   - Review the time-stamps in [EXAM_DATA] or keystroke logs. Did the candidate abandon the prompt at the first sign of difficulty? Did they attempt multiple iterations? Add this intelligence into the behavioral profile.

# OUTPUT FORMAT (Strict JSON)
Return ONLY a valid JSON object matching the requested schema. Do not include introductory text or markdown formatting outside the JSON structure.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          audit_summary: {
            type: Type.OBJECT,
            properties: {
              integrity_score: { type: Type.INTEGER, description: "Integrity score from 0 to 100 representing confidence in authenticity" },
              technical_score: { type: Type.INTEGER, description: "Technical capability/soundness score from 0 to 100" },
              verdict: { type: Type.STRING, description: "Clear, Review Recommended, or Failed Integrity Audit" },
            },
            required: ["integrity_score", "technical_score", "verdict"],
          },
          deep_analysis: {
            type: Type.OBJECT,
            properties: {
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 3 highly specific technical strengths found in their work."
              },
              weaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 3 highly specific technical weaknesses or flags."
              },
              behavioral_profile: { 
                type: Type.STRING,
                description: "A 2-3 sentence summary of their problem-solving style, resilience, and behavioral telemetry indicators."
              }
            },
            required: ["strengths", "weaknesses", "behavioral_profile"],
          },
          hiring_recommendation: {
            type: Type.OBJECT,
            properties: {
              decision: { type: Type.STRING, description: "Strong Proceed, Proceed with Interview Focus, or Reject" },
              justification: { type: Type.STRING, description: "Evidence-based, bulletproof justification for the hiring committee or hiring manager." }
            },
            required: ["decision", "justification"],
          }
        },
        required: ["audit_summary", "deep_analysis", "hiring_recommendation"],
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response content returned from Gemini API");
  }

  return JSON.parse(text);
}

// Endpoint for the recruitment auditor
app.post("/api/audit", async (req, res) => {
  try {
    const { jobContext, examData, behavioralTelemetry } = req.body;

    if (!jobContext || !examData || !behavioralTelemetry) {
      return res.status(400).json({ error: "Missing required fields: jobContext, examData, or behavioralTelemetry" });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return res.status(400).json({ 
        error: "Gemini API key is not configured in Secrets. Please add GEMINI_API_KEY in Settings." 
      });
    }

    const auditResult = await executeCandidateAudit(jobContext, examData, behavioralTelemetry);
    res.json(auditResult);
  } catch (error: any) {
    console.error("Audit API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during recruitment audit processing." });
  }
});

// Endpoint for RecruitAI Merit-Based ATS screening
app.post("/api/screen", async (req, res) => {
  try {
    const { candidateId, candidateName, candidateEmail, role, seniority, jobContext, resume } = req.body;

    if (!candidateId || !candidateName || !candidateEmail || !role || !resume) {
      return res.status(400).json({ error: "Missing required fields for screening: candidateId, candidateName, candidateEmail, role, or resume" });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return res.status(400).json({ 
        error: "Gemini API key is not configured in Secrets. Please add GEMINI_API_KEY in Settings." 
      });
    }

    const prompt = `
# ROLE
You are "RecruitAI Engine," an autonomous, multi-agent AI Human Resources Director and Recruitment Specialist. Your goal is to evaluate candidate profiles purely on objective merit, skills depth, and career trajectory.

# CONTEXT
1. CANDIDATE_NAME: ${candidateName}
2. CANDIDATE_EMAIL: ${candidateEmail}
3. CANDIDATE_ID: ${candidateId}
4. INTENDED_ROLE: ${role} (${seniority || "Not specified"})
5. JOB_REQUIREMENTS:
${JSON.stringify(jobContext || {}, null, 2)}

6. RAW_RESUME:
${resume}

# MISSION
Conduct a merit-based ATS screening. 

# SCREENING RULES
1. ANONYMIZATION: Strip out all demographic variables from the resume text (names, gender, age, specific location, exact graduation years, specific school names). Replace them with anonymous representations (e.g., "[ANONYMOUS SCHOOL]"). Put this anonymized version in payload.anonymizedProfile.
2. CONTEXTUAL SKILL VALIDATION: Ignore "keyword stuffing". Analyze the complexity of projects. Determine if they built complex architectures or just edited templates.
3. TRAJECTORY SCORE: Score from 0 to 100 based on employer selectivity, career longevity, and promotion frequency.
4. COMMUNICATIONS: Draft a human-like, personalized, encouraging email to the candidate's real email (${candidateEmail}) and name (${candidateName}):
   - If meritScore >= 60, set action to "SHORTLIST_RANK" and draft a "Shortlist & Test Dispatch" email containing a mock assessment portal link: [TEST_PORTAL_URL].
   - If meritScore < 60, set action to "EMAIL_DISPATCH" and draft a polite, constructive rejection email, providing them feedback on skills they should develop and informing them they are in the passive talent pool.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING },
            payload: {
              type: Type.OBJECT,
              properties: {
                candidateId: { type: Type.STRING },
                meritScore: { type: Type.INTEGER },
                justification: { type: Type.STRING },
                anonymizedProfile: { type: Type.STRING },
                emailDraft: {
                  type: Type.OBJECT,
                  properties: {
                    to: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    body: { type: Type.STRING }
                  },
                  required: ["to", "subject", "body"]
                }
              },
              required: ["candidateId", "meritScore", "justification", "anonymizedProfile", "emailDraft"]
            }
          },
          required: ["action", "payload"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content returned from Gemini API");
    }

    const screenResult = JSON.parse(text);
    res.json(screenResult);
  } catch (error: any) {
    console.error("Screening API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during ATS screening." });
  }
});

const VAULT_PATH = path.resolve(process.cwd(), "vault", "recruitment_data");

// Atomic JSON write operation to prevent write overlaps & partial file reads
function writeJsonAtomic(filePath: string, data: any): void {
  const tmpPath = `${filePath}.tmp`;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tmpPath, filePath);
  } catch (err: any) {
    if (fs.existsSync(tmpPath)) {
      try { fs.unlinkSync(tmpPath); } catch (e) {}
    }
    throw err;
  }
}

// Safe JSON read operation to prevent partial read overlaps and lock contentions
function readJsonSafely(filePath: string): any {
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err: any) {
    // Retry once after a 100ms delay in case of concurrent lock overlaps
    try {
      const fd = fs.openSync(filePath, 'r');
      fs.closeSync(fd); // Check file readiness
      content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content);
    } catch (e: any) {
      throw new Error(`JSON File Lock/Overlap Corruption at ${path.basename(filePath)}: ${e.message}`);
    }
  }
}

// Email notification service (logs to console; uses Resend if RESEND_API_KEY is set)
async function sendNotificationEmail(to: string, subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[Email] TO: ${to} | SUBJECT: ${subject}`);
    return { ok: true, mock: true };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'recruitai@yourplatform.com', to, subject, text: body }),
    });
    return { ok: res.ok, id: res.ok ? (await res.json()).id : undefined };
  } catch (err: any) {
    console.error(`[Email] Send failed: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

// Scheduler that checks for evaluations due for notification (4-hour release)
const NOTIFICATION_CHECK_INTERVAL = 60_000; // every minute
async function runNotificationScheduler() {
  try {
    if (!fs.existsSync(VAULT_PATH)) return;
    const companyIds = fs.readdirSync(VAULT_PATH);
    for (const companyId of companyIds) {
      const companyDir = path.join(VAULT_PATH, companyId);
      if (!fs.statSync(companyDir).isDirectory()) continue;
      const candDir = path.join(companyDir, "candidates");
      if (!fs.existsSync(candDir)) continue;
      const dirs = fs.readdirSync(candDir);
      for (const subDir of dirs) {
        if (!subDir.startsWith("BATCH")) continue;
        const targetDir = path.join(candDir, subDir);
        if (!fs.statSync(targetDir).isDirectory()) continue;
        const evalFile = path.join(targetDir, "evaluation.json");
        const metaFile = path.join(targetDir, "metadata.json");
        if (!fs.existsSync(evalFile) || !fs.existsSync(metaFile)) continue;
        try {
          const evaluation = readJsonSafely(evalFile);
          const metadata = readJsonSafely(metaFile);
          // Check if notification is due (past targetReleaseAt) and not yet sent
          if (evaluation.targetReleaseAt && Date.now() >= evaluation.targetReleaseAt && !evaluation.notifiedAt) {
            console.log(`[NotificationScheduler] Dispatch due for ${subDir} — sending result email to ${metadata.email}`);
            const result = await sendNotificationEmail(
              metadata.email,
              "RecruitAI: Your Assessment Results Are Ready",
              `Hi,\n\nYour technical assessment results are now ready.\n\nVisit the portal: ${process.env.APP_URL || 'http://localhost:3000'}\nUse: Company ID: ${companyId}, Roll Number: ${subDir}\n\n— RecruitAI Team`
            );
            if (result.ok) {
              evaluation.notifiedAt = new Date().toISOString();
              writeJsonAtomic(evalFile, evaluation);
              console.log(`[NotificationScheduler] Notification sent for ${subDir}`);
            }
          }
        } catch (e) { /* skip corrupt entries */ }
      }
    }
  } catch (err) {
    console.error("[NotificationScheduler] Error:", err);
  }
}

// Helper to determine if a resume has already been processed for a client
function isResumeProcessed(candDir: string, filename: string): boolean {
  if (!fs.existsSync(candDir)) return false;
  const dirs = fs.readdirSync(candDir);
  for (const dirName of dirs) {
    const subPath = path.join(candDir, dirName);
    if (!fs.statSync(subPath).isDirectory()) continue;
    const metadataPath = path.join(subPath, "metadata.json");
    if (fs.existsSync(metadataPath)) {
      try {
        const meta = readJsonSafely(metadataPath);
        if (meta.sourceFile === filename) return true;
      } catch (e) {}
    }
  }
  return false;
}

// Background polling loop for folder structures (Protocols 1 & 2)
async function runVaultWatcher() {
  try {
    if (!fs.existsSync(VAULT_PATH)) {
      fs.mkdirSync(VAULT_PATH, { recursive: true });
    }

    const companyIds = fs.readdirSync(VAULT_PATH);
    for (const companyId of companyIds) {
      const companyDir = path.join(VAULT_PATH, companyId);
      if (!fs.statSync(companyDir).isDirectory()) continue;

      const configFile = path.join(companyDir, "config.json");
      const rawDir = path.join(companyDir, "raw_resumes");
      const candDir = path.join(companyDir, "candidates");

      // Ensure folders exist
      if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
      if (!fs.existsSync(candDir)) fs.mkdirSync(candDir, { recursive: true });

      // Create dummy config.json if missing to assist client onboarding
      if (!fs.existsSync(configFile)) {
        const defaultConfig = {
          companyName: "TechCorp",
          role: "Senior React Developer",
          seniority: "Senior",
          jobContext: {
            roleRequirements: "Design and implement responsive distributed interface components.",
            coreTechStack: "React 19, TypeScript, Tailwind CSS"
          }
        };
        writeJsonAtomic(configFile, defaultConfig);
      }

      // Read B2B client config
      let configData: any = {};
      try {
        configData = readJsonSafely(configFile);
      } catch (e) {
        console.error(`[RecruitAI] Failed to parse config.json for company: ${companyId}`);
        continue;
      }

      // PROTOCOL 1: Watch raw resumes directory
      const files = fs.readdirSync(rawDir);
      for (const file of files) {
        const resumePath = path.join(rawDir, file);
        if (fs.statSync(resumePath).isDirectory()) continue;

        // Skip if already evaluated
        if (isResumeProcessed(candDir, file)) continue;

        console.log(`[RecruiterCore_CLI] Protocol 1: Screening new resume: "${file}" for client: "${companyId}"`);

        const resumeContent = fs.readFileSync(resumePath, "utf8");
        const candidateEmail = `${path.parse(file).name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@example.com`;

        try {
          if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
            console.error("[RecruitAI] Gemini API Key is not configured. Skipping resume parse.");
            continue;
          }

          const prompt = `
# ROLE
You are "RecruitAI Engine," an autonomous, multi-agent AI Human Resources Director and Recruitment Specialist. Your goal is to evaluate candidate profiles purely on objective merit, skills depth, and career trajectory.

# CONTEXT
1. INTENDED_ROLE: ${configData.role || "Software Engineer"} (${configData.seniority || "Not specified"})
2. JOB_REQUIREMENTS:
${JSON.stringify(configData.jobContext || {}, null, 2)}

3. RAW_RESUME:
${resumeContent}

# MISSION
Conduct a merit-based ATS screening. 

# SCREENING RULES
1. ANONYMIZATION: Strip out all demographic variables from the resume text (names, gender, age, specific location, exact graduation years, specific school names). Replace them with anonymous representations (e.g., "[ANONYMOUS SCHOOL]"). Put this anonymized version in payload.anonymizedProfile.
2. CONTEXTUAL SKILL VALIDATION: Ignore "keyword stuffing". Analyze the complexity of projects. Determine if they built complex architectures or just edited templates.
3. TRAJECTORY SCORE: Score from 0 to 100 based on employer selectivity, career longevity, and promotion frequency.
4. COMMUNICATIONS: Draft a human-like, personalized, encouraging email to the candidate:
   - If meritScore >= 60, set action to "SHORTLIST_RANK" and draft a "Shortlist & Test Dispatch" email containing a mock assessment portal link: [TEST_PORTAL_URL].
   - If meritScore < 60, set action to "EMAIL_DISPATCH" and draft a polite, constructive rejection email, providing them feedback on skills they should develop and informing them they are in the passive talent pool.
`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  payload: {
                    type: Type.OBJECT,
                    properties: {
                      candidateId: { type: Type.STRING },
                      meritScore: { type: Type.INTEGER },
                      justification: { type: Type.STRING },
                      anonymizedProfile: { type: Type.STRING },
                      emailDraft: {
                        type: Type.OBJECT,
                        properties: {
                          to: { type: Type.STRING },
                          subject: { type: Type.STRING },
                          body: { type: Type.STRING }
                        },
                        required: ["to", "subject", "body"]
                      }
                    },
                    required: ["candidateId", "meritScore", "justification", "anonymizedProfile", "emailDraft"]
                  }
                },
                required: ["action", "payload"]
              }
            }
          });

          const text = response.text;
          if (text) {
            const parsed = JSON.parse(text);
            const filenameWithoutExt = path.parse(file).name;
            const meritScore = parsed.payload.meritScore;
            
            if (meritScore >= 60) {
              // Generate Joint Roll Number: BATCH-Year-CompanyAbbrev-RandomHex4
              const yearSuffix = new Date().getFullYear().toString().substr(2, 2); // e.g. 26
              const abbrev = companyId.replace(/[^a-zA-Z]/g, '').substr(0, 3).toUpperCase().padEnd(3, 'X');
              const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
              const rollNumber = `BATCH${yearSuffix}-${abbrev}-${randomHex}`;

              const targetDir = path.join(candDir, rollNumber);
              fs.mkdirSync(targetDir, { recursive: true });

              const metadata = {
                candidateId: filenameWithoutExt,
                rollNumber: rollNumber,
                status: "SHORTLISTED",
                meritScore: meritScore,
                sourceFile: file,
                companyId: companyId,
                email: candidateEmail,
                anonymizedProfile: parsed.payload.anonymizedProfile,
                justification: parsed.payload.justification,
                invitationEmail: {
                  to: candidateEmail,
                  subject: "Invitation: Secure Test Workspace",
                  body: `Hi,\n\nYou have been shortlisted for ${configData.role || "Software Developer"}.\n\nTo initialize your secure test workspace, go to: [TEST_PORTAL_URL]\nEnter Credentials:\nCompany ID: ${companyId}\nJoint Roll Number: ${rollNumber}`
                }
              };

              writeJsonAtomic(path.join(targetDir, "metadata.json"), metadata);
              console.log(`[RecruiterCore_CLI] Generated Roll: ${rollNumber} for candidate: ${filenameWithoutExt}`);
              // Dispatch credential email
              sendNotificationEmail(candidateEmail, metadata.invitationEmail.subject, metadata.invitationEmail.body);
            } else {
              // Create rejected candidate folder
              const targetDir = path.join(candDir, `${filenameWithoutExt}_rejected`);
              fs.mkdirSync(targetDir, { recursive: true });

              const metadata = {
                candidateId: filenameWithoutExt,
                status: "REJECTED",
                meritScore: meritScore,
                sourceFile: file,
                companyId: companyId,
                email: candidateEmail,
                anonymizedProfile: parsed.payload.anonymizedProfile,
                justification: parsed.payload.justification,
                rejectionEmail: {
                  to: candidateEmail,
                  subject: "Application Update: RecruitAI",
                  body: `Hi,\n\nThank you for applying. We reviewed your profile but are not proceeding at this time.\n\nConstructive feedback:\n${parsed.payload.justification}\n\nWe have retained your details in our Passive Talent Pool.`
                }
              };

              writeJsonAtomic(path.join(targetDir, "metadata.json"), metadata);
              console.log(`[RecruiterCore_CLI] Candidate Rejected: ${filenameWithoutExt} (Merit: ${meritScore}%)`);
            }
          }
        } catch (e: any) {
          console.error(`[RecruiterCore_CLI] Screening failed for ${file}:`, e.message || e);
        }
      }

      // PROTOCOL 2: Listen for submitted tests in candidates folder (integrating VibeAudit)
      const candidateDirs = fs.readdirSync(candDir);
      for (const candSubDir of candidateDirs) {
        const targetPath = path.join(candDir, candSubDir);
        if (!fs.statSync(targetPath).isDirectory()) continue;
        if (!candSubDir.startsWith("BATCH")) continue; // Only process shortlisted ones

        const testSessionFile = path.join(targetPath, "test_session.json");
        const evaluationFile = path.join(targetPath, "evaluation.json");
        const metadataFile = path.join(targetPath, "metadata.json");

        if (fs.existsSync(testSessionFile) && !fs.existsSync(evaluationFile) && fs.existsSync(metadataFile)) {
          try {
            const testSession = readJsonSafely(testSessionFile);
            const metadata = readJsonSafely(metadataFile);

            if (testSession.status === "TEST_SUBMITTED" || testSession.submitted) {
              const submittedAt = testSession.submittedAt || fs.statSync(testSessionFile).mtimeMs;
              const targetReleaseAt = submittedAt + 4 * 60 * 60 * 1000; // 4 hours later

              console.log(`[RecruiterCore_CLI] Protocol 2: Detected test submission for Roll: ${candSubDir}. Running Code Audit...`);

              // Perform Gemini Code & Telemetry Audit
              const examData = {
                questionPrompt: testSession.questionPrompt || "Design rate limiter",
                candidateAnswer: testSession.candidateAnswer || "",
                typingDurationMin: testSession.typingDurationMin || 10,
                incrementalAttempts: testSession.incrementalAttempts || []
              };
              const behavioralTelemetry = {
                tabSwitchesCount: testSession.tabSwitchesCount || 0,
                bulkPastesCount: testSession.bulkPastesCount || 0,
                averageTypingSpeedWpm: testSession.averageTypingSpeedWpm || 50,
                events: testSession.events || []
              };

              const auditReport = await executeCandidateAudit(configData.jobContext, examData, behavioralTelemetry);

              const evaluation = {
                rollNumber: candSubDir,
                submittedAt: submittedAt,
                targetReleaseAt: targetReleaseAt,
                auditReport: auditReport,
                resultEmail: {
                  to: metadata.email,
                  subject: "RecruitAI Test Results Compiled",
                  body: `Hi,\n\nYour technical assessment results are now compiled.\n\nYou can access your results at the primary recruitment portal using credentials:\nCompany Selection: ${companyId}\nRoll Number: ${candSubDir}\n\nBest regards,\nRecruitAI Team`
                }
              };

              writeJsonAtomic(evaluationFile, evaluation);
              console.log(`[RecruiterCore_CLI] Completed Audit for ${candSubDir}. Localized release epoch: ${targetReleaseAt} (4-hour delay active)`);

              // PROTOCOL 3: Permanent Database Record Archival
              try {
                const dbFile = path.join(VAULT_PATH, "database.json");
                let db: any = {};
                if (fs.existsSync(dbFile)) {
                  try {
                    db = readJsonSafely(dbFile);
                  } catch (e) {}
                }

                if (!db[companyId]) {
                  db[companyId] = {
                    companyName: configData.companyName || companyId,
                    historicalRecords: []
                  };
                }

                const newRecord = {
                  rollNumber: candSubDir,
                  candidateId: metadata.candidateId,
                  email: metadata.email,
                  meritScore: metadata.meritScore,
                  status: "EVALUATED",
                  anonymizedProfile: metadata.anonymizedProfile,
                  testSession: testSession,
                  evaluation: evaluation,
                  archivedAt: new Date().toISOString()
                };

                const records = db[companyId].historicalRecords || [];
                const idx = records.findIndex((r: any) => r.rollNumber === candSubDir);
                if (idx >= 0) {
                  records[idx] = newRecord;
                } else {
                  records.push(newRecord);
                }
                db[companyId].historicalRecords = records;

                writeJsonAtomic(dbFile, db);
                console.log(`[RecruiterCore_CLI] Protocol 3: Permanent consolidated evaluation archived for company: ${companyId}, roll: ${candSubDir}`);
              } catch (dbErr: any) {
                console.error(`[RecruiterCore_CLI] Database Archival Failed for ${candSubDir}:`, dbErr.message || dbErr);
              }
            }
          } catch (e: any) {
            console.error(`[RecruiterCore_CLI] Failed compiling assessment for ${candSubDir}:`, e.message || e);
          }
        }
      }
    }
  } catch (err: any) {
    console.error("[RecruiterCore_CLI] Error during directory poll:", err.message || err);
  }
}

function startBackgroundWorkers() {
  console.log(`[RecruiterCore_CLI] Directory Watcher active on: ${VAULT_PATH}`);
  setInterval(runVaultWatcher, 5000);
  runVaultWatcher();
  setInterval(runNotificationScheduler, NOTIFICATION_CHECK_INTERVAL);
  console.log(`[NotificationScheduler] Started (check every ${NOTIFICATION_CHECK_INTERVAL / 1000}s)`);
}

// Endpoint to list all processed vault candidates
app.get("/api/vault-candidates", async (req, res) => {
  try {
    if (!fs.existsSync(VAULT_PATH)) {
      return res.json([]);
    }

    const list: any[] = [];
    const companyIds = fs.readdirSync(VAULT_PATH);

    for (const companyId of companyIds) {
      const companyDir = path.join(VAULT_PATH, companyId);
      if (!fs.statSync(companyDir).isDirectory()) continue;

      const candDir = path.join(companyDir, "candidates");
      if (!fs.existsSync(candDir)) continue;

      const candDirs = fs.readdirSync(candDir);
      for (const candSubDir of candDirs) {
        const subPath = path.join(candDir, candSubDir);
        if (!fs.statSync(subPath).isDirectory()) continue;

        const metadataFile = path.join(subPath, "metadata.json");
        const evaluationFile = path.join(subPath, "evaluation.json");

        if (fs.existsSync(metadataFile)) {
          try {
            const metadata = readJsonSafely(metadataFile);
            const evaluation = fs.existsSync(evaluationFile)
              ? readJsonSafely(evaluationFile)
              : null;

            list.push({
              companyId,
              candidateId: metadata.candidateId,
              rollNumber: metadata.rollNumber || null,
              status: metadata.status,
              meritScore: metadata.meritScore,
              anonymizedProfile: metadata.anonymizedProfile,
              justification: metadata.justification,
              invitationEmail: metadata.invitationEmail || null,
              rejectionEmail: metadata.rejectionEmail || null,
              evaluation: evaluation
            });
          } catch (e) {}
        }
      }
    }
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to retrieve vault candidates" });
  }
});

// Endpoint to get a specific B2B client config
app.get("/api/vault-config/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;
    const companyDir = path.join(VAULT_PATH, companyId);
    const configFile = path.join(companyDir, "config.json");

    if (!fs.existsSync(configFile)) {
      return res.status(404).json({ error: "Company config not found" });
    }

    const config = readJsonSafely(configFile);
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to read config" });
  }
});

// Endpoint to update or create a B2B client config
app.post("/api/vault-config", async (req, res) => {
  try {
    const { companyId, companyName, role, seniority, jobContext, subscription } = req.body;
    if (!companyId) {
      return res.status(400).json({ error: "Missing companyId parameter" });
    }

    const companyDir = path.join(VAULT_PATH, companyId);
    if (!fs.existsSync(companyDir)) {
      fs.mkdirSync(companyDir, { recursive: true });
    }

    // Ensure raw_resumes and candidates dirs are also generated
    const rawDir = path.join(companyDir, "raw_resumes");
    const candDir = path.join(companyDir, "candidates");
    if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
    if (!fs.existsSync(candDir)) fs.mkdirSync(candDir, { recursive: true });

    const configFile = path.join(companyDir, "config.json");
    const existing = fs.existsSync(configFile)
      ? readJsonSafely(configFile)
      : {};

    const updated = {
      ...existing,
      companyName: companyName || existing.companyName || companyId,
      role: role || existing.role || "Software Developer",
      seniority: seniority || existing.seniority || "Senior",
      jobContext: jobContext || existing.jobContext || {
        roleRequirements: "Design and implement custom software routines.",
        coreTechStack: "Node.js, TypeScript"
      },
      subscription: subscription || existing.subscription || {
        planName: "Starter Tier",
        priceMonthly: 99,
        maxResumes: 50,
        maxTracks: 2
      }
    };

    writeJsonAtomic(configFile, updated);
    console.log(`[RecruiterCore_CLI] Corporate Configuration updated for client: "${companyId}"`);
    res.json({ success: true, config: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update config" });
  }
});

// SHARED PATH MONITOR & INTEGRITY VALIDATOR ENDPOINT
app.get("/api/vault-integrity", async (req, res) => {
  try {
    const issues: any[] = [];
    let healthy = true;

    if (!fs.existsSync(VAULT_PATH)) {
      return res.json({ healthy: true, issues: [], message: "Vault folder not initialized yet." });
    }

    const companyIds = fs.readdirSync(VAULT_PATH);
    for (const companyId of companyIds) {
      const companyDir = path.join(VAULT_PATH, companyId);
      if (!fs.statSync(companyDir).isDirectory()) continue;

      const candDir = path.join(companyDir, "candidates");
      if (!fs.existsSync(candDir)) continue;

      const candSubDirs = fs.readdirSync(candDir);
      for (const candSubDir of candSubDirs) {
        const targetDir = path.join(candDir, candSubDir);
        if (!fs.statSync(targetDir).isDirectory()) continue;

        const metadataFile = path.join(targetDir, "metadata.json");
        const testSessionFile = path.join(targetDir, "test_session.json");
        const evaluationFile = path.join(targetDir, "evaluation.json");

        // 1. Audit metadata.json
        let hasMeta = fs.existsSync(metadataFile);
        if (hasMeta) {
          try {
            readJsonSafely(metadataFile);
          } catch (e: any) {
            healthy = false;
            issues.push({
              level: "ERROR",
              category: "FILE_CORRUPTION",
              companyId,
              candidate: candSubDir,
              file: "metadata.json",
              message: `Lock/Corruption overlap detected: ${e.message}`
            });
          }
        }

        // 2. Audit test_session.json
        let hasTest = fs.existsSync(testSessionFile);
        if (hasTest) {
          try {
            readJsonSafely(testSessionFile);
          } catch (e: any) {
            healthy = false;
            issues.push({
              level: "ERROR",
              category: "FILE_CORRUPTION",
              companyId,
              candidate: candSubDir,
              file: "test_session.json",
              message: `Lock/Corruption overlap detected: ${e.message}`
            });
          }
        }

        // 3. Audit evaluation.json
        let hasEval = fs.existsSync(evaluationFile);
        if (hasEval) {
          try {
            readJsonSafely(evaluationFile);
          } catch (e: any) {
            healthy = false;
            issues.push({
              level: "ERROR",
              category: "FILE_CORRUPTION",
              companyId,
              candidate: candSubDir,
              file: "evaluation.json",
              message: `Lock/Corruption overlap detected: ${e.message}`
            });
          }
        }

        // 4. State Sync validation (Orphans and flow checks)
        if (candSubDir.startsWith("BATCH")) {
          if (!hasMeta) {
            healthy = false;
            issues.push({
              level: "WARNING",
              category: "ORPHAN_META",
              companyId,
              candidate: candSubDir,
              message: `Missing metadata.json structure for shortlist roll number.`
            });
          }
          if (hasEval && !hasTest) {
            healthy = false;
            issues.push({
              level: "ERROR",
              category: "SYNC_ERROR",
              companyId,
              candidate: candSubDir,
              message: `Invalid Execution Flow: evaluation.json exists but test_session.json is missing.`
            });
          }
        }
      }
    }

    res.json({
      healthy,
      scanTime: new Date().toISOString(),
      issuesCount: issues.length,
      issues
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed running vault integrity scan" });
  }
});

// Endpoint to retrieve permanent archived B2B records
app.get("/api/vault-database/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;
    const dbFile = path.join(VAULT_PATH, "database.json");
    if (!fs.existsSync(dbFile)) {
      return res.json({ companyId, historicalRecords: [] });
    }
    const db = readJsonSafely(dbFile);
    if (!db[companyId]) {
      return res.json({ companyId, historicalRecords: [] });
    }
    res.json(db[companyId]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load database ledger" });
  }
});

// Endpoint to authenticate candidate entry into the proctoring portal
app.post("/api/auth-test", async (req, res) => {
  try {
    const { companyId, rollNumber } = req.body;
    if (!companyId || !rollNumber) {
      return res.status(400).json({ error: "Missing Company ID or Joint Roll Number." });
    }

    const companyDir = path.join(VAULT_PATH, companyId);
    const metadataFile = path.join(companyDir, "candidates", rollNumber, "metadata.json");
    const testSessionFile = path.join(companyDir, "candidates", rollNumber, "test_session.json");

    if (!fs.existsSync(metadataFile)) {
      return res.status(404).json({ error: "Authentication Failed: Joint Roll Number or Company ID is invalid." });
    }

    const metadata = readJsonSafely(metadataFile);

    // Check if locked/terminated
    if (fs.existsSync(testSessionFile)) {
      const session = readJsonSafely(testSessionFile);
      if (session.status === "TERMINATED_FRAUD" || session.status === "TEST_SUBMITTED") {
        return res.status(403).json({ error: "Access Forbidden: This test workspace link is permanently locked or already completed." });
      }
    }

    res.json({ success: true, metadata });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to authenticate test candidate" });
  }
});

// Endpoint to submit candidate test data and proctoring telemetry
app.post("/api/submit-test", async (req, res) => {
  try {
    const { companyId, rollNumber, examData, telemetry, status } = req.body;
    if (!companyId || !rollNumber || !status) {
      return res.status(400).json({ error: "Missing required fields: companyId, rollNumber, or status." });
    }

    const companyDir = path.join(VAULT_PATH, companyId);
    const candidateDir = path.join(companyDir, "candidates", rollNumber);
    const testSessionFile = path.join(candidateDir, "test_session.json");

    if (!fs.existsSync(candidateDir)) {
      return res.status(404).json({ error: "Candidate workspace directory not found." });
    }

    const sessionPayload = {
      status, // "TEST_SUBMITTED" | "TERMINATED_FRAUD" | "NETWORK_RESET"
      submittedAt: Date.now(),
      questionPrompt: examData?.questionPrompt || "Design rate limiter",
      candidateAnswer: examData?.candidateAnswer || "",
      typingDurationMin: examData?.typingDurationMin || 10,
      tabSwitchesCount: telemetry?.tabSwitchesCount || 0,
      bulkPastesCount: telemetry?.bulkPastesCount || 0,
      averageTypingSpeedWpm: telemetry?.averageTypingSpeedWpm || 50,
      events: telemetry?.events || []
    };

    writeJsonAtomic(testSessionFile, sessionPayload);
    console.log(`[RecruiterCore_CLI] Proctor Session updated for Roll: ${rollNumber}. Status: ${status}`);
    res.json({ success: true, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to submit proctoring data" });
  }
});

// Helper: generate client ID from serial, plan category, and name
function generateClientId(serial: number, plan: string, name: string): string {
  const planAbbr = plan.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
  const nameWords = name.split(' ').filter(Boolean).map(w => w[0].toUpperCase()).join('');
  const serialStr = String(serial).padStart(3, '0');
  return `${planAbbr}-${serialStr}-${nameWords}`;
}

// Helper: hash password
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Helper: verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Unified Login: detects admin vs client by ID format
app.post("/api/auth/login", async (req, res) => {
  try {
    const { loginId, password } = req.body;
    console.log("[Login Attempt]", { loginId, hasPassword: !!password, supabaseAvailable: !!supabase });
    if (!loginId) {
      return res.status(400).json({ error: "Login ID is required." });
    }

    // Development fallback: allow login without Supabase when using default credentials
    if (!supabase) {
      if (loginId === "hassaan123" && password === "hassaan123") {
        return res.json({ role: "admin", id: "hassaan123" });
      }
      return res.status(500).json({ error: "Database not configured. Please set up Supabase or use default admin credentials." });
    }

    if (loginId === "hassaan123") {
      if (!password) {
        return res.status(400).json({ error: "Admin password is required.", needsPassword: true });
      }
      const { data: admin, error } = await supabase
        .from("admins")
        .select("*")
        .eq("id", "hassaan123")
        .single();

      if (error || !admin) {
        console.log("[Admin Login] Admin not found:", error);
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const valid = await verifyPassword(password, admin.password_hash);
      console.log("[Admin Login] Password valid:", valid);
      if (!valid) {
        return res.status(401).json({ error: "Invalid admin password." });
      }

      return res.json({ role: "admin", id: admin.id });
    }

    const { data: client, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", loginId)
      .single();

    if (error || !client) {
      console.log("[Client Login] Client not found:", loginId, error);
      return res.status(404).json({ error: "Client ID not found. Please contact your administrator." });
    }

    return res.json({ role: "client", id: client.id, name: client.name, email: client.email, company: client.company, plan: client.plan, category: client.category, expiresAt: client.expires_at });
  } catch (err: any) {
    console.error("[Login Error]", err);
    res.status(500).json({ error: err.message || "Login failed." });
  }
});

// Admin: Register new client
app.post("/api/admin/register-client", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured." });
    const { name, email, company, plan, category, password, expiresAt } = req.body;
    if (!name || !email || !plan || !category || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Determine next serial number for this plan+category combo
    const prefix = plan.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
    const { data: existing } = await supabase
      .from("clients")
      .select("id")
      .like("id", `${prefix}-%`)
      .order("id", { ascending: false })
      .limit(1);

    let serial = 1;
    if (existing && existing.length > 0) {
      const lastId = existing[0].id;
      const parts = lastId.split('-');
      if (parts.length >= 2) {
        const lastSerial = parseInt(parts[parts.length - 2], 10);
        if (!isNaN(lastSerial)) serial = lastSerial + 1;
      }
    }

    const clientId = generateClientId(serial, plan, name);
    const passwordHash = await hashPassword(password);

    const { data, error } = await supabase
      .from("clients")
      .insert([{
        id: clientId,
        name,
        email,
        company: company || "",
        plan,
        category,
        password_hash: passwordHash,
        expires_at: expiresAt || null
      }])
      .select()
      .single();

    if (error) throw error;

    // Create subscription record
    await supabase.from("subscriptions").insert([{
      client_id: clientId,
      plan,
      category,
      expires_at: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }]);

    res.json({ success: true, client: { id: clientId, name, email, company, plan, category, expiresAt: data.expires_at } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to register client." });
  }
});

// Admin: List all clients
app.get("/api/admin/clients", async (req, res) => {
  try {
    if (!supabase) return res.json([]);
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load clients." });
  }
});

// Admin: Update client
app.put("/api/admin/clients/:id", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured." });
    const { id } = req.params;
    const { name, email, company, plan, category, expiresAt, password } = req.body;

    const updates: any = { name, email, company, plan, category, expires_at: expiresAt };
    if (password) {
      updates.password_hash = await hashPassword(password);
    }

    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Update subscription if plan/category changed
    if (plan || category) {
      await supabase.from("subscriptions").upsert({
        client_id: id,
        plan: plan || data.plan,
        category: category || data.category,
        expires_at: expiresAt || data.expires_at
      });
    }

    res.json({ success: true, client: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update client." });
  }
});

// Admin: Delete client
app.delete("/api/admin/clients/:id", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured." });
    const { id } = req.params;
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete client." });
  }
});

// Client: Dashboard stats
app.get("/api/client/dashboard", async (req, res) => {
  try {
    if (!supabase) return res.json({ requests: [], hirings: [], stats: {} });
    const { clientId } = req.query;
    if (!clientId) return res.status(400).json({ error: "clientId required." });

    const { data: requests } = await supabase.from("requests").select("*").eq("client_id", clientId).order("created_at", { ascending: false });
    const { data: hirings } = await supabase.from("hirings").select("*").eq("client_id", clientId).order("created_at", { ascending: false });
    const { data: subscription } = await supabase.from("subscriptions").select("*").eq("client_id", clientId).single();

    const totalRequests = requests?.length || 0;
    const pendingRequests = requests?.filter((r: any) => r.status === "Pending").length || 0;
    const totalHirings = hirings?.length || 0;
    const successfulHirings = hirings?.filter((h: any) => h.status === "Completed" || h.status === "Hired").length || 0;
    const successRatio = totalHirings > 0 ? Math.round((successfulHirings / totalHirings) * 100) : 0;

    let daysLeft = 0;
    if (subscription?.expires_at) {
      const diff = new Date(subscription.expires_at).getTime() - Date.now();
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    res.json({
      requests: requests || [],
      hirings: hirings || [],
      stats: {
        totalRequests,
        pendingRequests,
        totalHirings,
        successfulHirings,
        successRatio,
        daysLeft,
        subscription
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load dashboard." });
  }
});

// Client: Add request
app.post("/api/client/requests", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured." });
    const { clientId, type, details } = req.body;
    const { data, error } = await supabase.from("requests").insert([{ client_id: clientId, type, details, status: "Pending" }]).select().single();
    if (error) throw error;
    res.json({ success: true, request: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add request." });
  }
});

// Client: Add hiring
app.post("/api/client/hirings", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured." });
    const { clientId, candidateName, role, status } = req.body;
    const { data, error } = await supabase.from("hirings").insert([{ client_id: clientId, candidate_name: candidateName, role, status: status || "Pending" }]).select().single();
    if (error) throw error;
    res.json({ success: true, hiring: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add hiring." });
  }
});

// Client: Update hiring status
app.put("/api/client/hirings/:id", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured." });
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabase.from("hirings").update({ status }).eq("id", id).select().single();
    if (error) throw error;
    res.json({ success: true, hiring: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update hiring." });
  }
});

// Client: Delete request
app.delete("/api/client/requests/:id", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured." });
    const { id } = req.params;
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete request." });
  }
});

// Client: Delete hiring
app.delete("/api/client/hirings/:id", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured." });
    const { id } = req.params;
    const { error } = await supabase.from("hirings").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete hiring." });
  }
});

// Admin: Dashboard overview stats
app.get("/api/admin/overview", async (req, res) => {
  try {
    if (!supabase) return res.json({ totalClients: 0, activeTests: 0, totalSubscriptions: 0, totalRequests: 0, totalHirings: 0, recentActivity: [] });
    const { data: clients } = await supabase.from("clients").select("id, name, plan, category, created_at");
    const { data: subscriptions } = await supabase.from("subscriptions").select("client_id, plan, expires_at");
    const { data: requests } = await supabase.from("requests").select("id, type, status, created_at").order("created_at", { ascending: false }).limit(20);
    const { data: hirings } = await supabase.from("hirings").select("id, candidate_name, role, status, created_at").order("created_at", { ascending: false }).limit(20);

    const activeTests =hirings?.filter((h: any) => h.status === "Pending" || h.status === "Hired").length || 0;
    const now = new Date();
    const activeSubscriptions = subscriptions?.filter((s: any) => new Date(s.expires_at) > now).length || 0;

    res.json({
      totalClients: clients?.length || 0,
      activeTests,
      totalSubscriptions: activeSubscriptions,
      totalRequests: requests?.length || 0,
      totalHirings: hirings?.length || 0,
      recentActivity: [...(requests || []).map((r: any) => ({ ...r, type: "Request" })), ...(hirings || []).map((h: any) => ({ ...h, type: "Hiring" }))].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load overview." });
  }
});

// Admin: List all subscriptions
app.get("/api/admin/subscriptions", async (req, res) => {
  try {
    if (!supabase) return res.json([]);
    const { data, error } = await supabase.from("subscriptions").select("*, clients(name, email, company)").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load subscriptions." });
  }
});

// Admin: Update subscription
app.put("/api/admin/subscriptions/:clientId", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured." });
    const { clientId } = req.params;
    const { plan, category, expiresAt } = req.body;
    const { data, error } = await supabase.from("subscriptions").update({ plan, category, expires_at: expiresAt }).eq("client_id", clientId).select().single();
    if (error) throw error;
    res.json({ success: true, subscription: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update subscription." });
  }
});

// Admin: Get all test sessions from vault
app.get("/api/admin/test-sessions", async (req, res) => {
  try {
    const VAULT_PATH = path.resolve(process.cwd(), "vault", "recruitment_data");
    if (!fs.existsSync(VAULT_PATH)) return res.json([]);
    const sessions: any[] = [];
    const companyIds = fs.readdirSync(VAULT_PATH);
    for (const companyId of companyIds) {
      const companyDir = path.join(VAULT_PATH, companyId);
      if (!fs.statSync(companyDir).isDirectory()) continue;
      const candDir = path.join(companyDir, "candidates");
      if (!fs.existsSync(candDir)) continue;
      const candDirs = fs.readdirSync(candDir);
      for (const candSubDir of candDirs) {
        const targetPath = path.join(candDir, candSubDir);
        if (!fs.statSync(targetPath).isDirectory()) continue;
        const testSessionFile = path.join(targetPath, "test_session.json");
        const metadataFile = path.join(targetPath, "metadata.json");
        if (!fs.existsSync(testSessionFile) || !fs.existsSync(metadataFile)) continue;
        try {
          const session = readJsonSafely(testSessionFile);
          const metadata = readJsonSafely(metadataFile);
          sessions.push({ companyId, rollNumber: candSubDir, session, metadata });
        } catch (e) {}
      }
    }
    res.json(sessions);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load test sessions." });
  }
});

// Admin: Terminate test session
app.post("/api/admin/terminate-test", async (req, res) => {
  try {
    const { companyId, rollNumber } = req.body;
    const VAULT_PATH = path.resolve(process.cwd(), "vault", "recruitment_data");
    const candidateDir = path.join(VAULT_PATH, companyId, "candidates", rollNumber);
    const testSessionFile = path.join(candidateDir, "test_session.json");
    if (!fs.existsSync(testSessionFile)) return res.status(404).json({ error: "Test session not found." });
    const session = readJsonSafely(testSessionFile);
    session.status = "TERMINATED_FRAUD";
    session.terminatedAt = new Date().toISOString();
    session.terminatedBy = "admin";
    writeJsonAtomic(testSessionFile, session);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to terminate test." });
  }
});

// Admin: Vault integrity scan
app.get("/api/admin/vault-integrity", async (req, res) => {
  try {
    const VAULT_PATH = path.resolve(process.cwd(), "vault", "recruitment_data");
    if (!fs.existsSync(VAULT_PATH)) return res.json({ healthy: true, issues: [] });
    const issues: any[] = [];
    let healthy = true;
    const companyIds = fs.readdirSync(VAULT_PATH);
    for (const companyId of companyIds) {
      const companyDir = path.join(VAULT_PATH, companyId);
      if (!fs.statSync(companyDir).isDirectory()) continue;
      const candDir = path.join(companyDir, "candidates");
      if (!fs.existsSync(candDir)) continue;
      const candSubDirs = fs.readdirSync(candDir);
      for (const candSubDir of candSubDirs) {
        const targetDir = path.join(candDir, candSubDir);
        if (!fs.statSync(targetDir).isDirectory()) continue;
        const metadataFile = path.join(targetDir, "metadata.json");
        const testSessionFile = path.join(targetDir, "test_session.json");
        const evaluationFile = path.join(targetDir, "evaluation.json");
        if (fs.existsSync(metadataFile)) {
          try { readJsonSafely(metadataFile); } catch (e: any) { healthy = false; issues.push({ level: "ERROR", category: "FILE_CORRUPTION", companyId, candidate: candSubDir, file: "metadata.json", message: e.message }); }
        }
        if (fs.existsSync(testSessionFile)) {
          try { readJsonSafely(testSessionFile); } catch (e: any) { healthy = false; issues.push({ level: "ERROR", category: "FILE_CORRUPTION", companyId, candidate: candSubDir, file: "test_session.json", message: e.message }); }
        }
        if (fs.existsSync(evaluationFile)) {
          try { readJsonSafely(evaluationFile); } catch (e: any) { healthy = false; issues.push({ level: "ERROR", category: "FILE_CORRUPTION", companyId, candidate: candSubDir, file: "evaluation.json", message: e.message }); }
        }
        if (candSubDir.startsWith("BATCH")) {
          if (!fs.existsSync(metadataFile)) { healthy = false; issues.push({ level: "WARNING", category: "ORPHAN_META", companyId, candidate: candSubDir, message: "Missing metadata.json" }); }
          if (fs.existsSync(evaluationFile) && !fs.existsSync(testSessionFile)) { healthy = false; issues.push({ level: "ERROR", category: "SYNC_ERROR", companyId, candidate: candSubDir, message: "evaluation.json exists but test_session.json is missing" }); }
        }
      }
    }
    res.json({ healthy, scanTime: new Date().toISOString(), issuesCount: issues.length, issues });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed running vault integrity scan" });
  }
});

// Admin: Database ledger
app.get("/api/admin/database-ledger", async (req, res) => {
  try {
    const VAULT_PATH = path.resolve(process.cwd(), "vault", "recruitment_data");
    const dbFile = path.join(VAULT_PATH, "database.json");
    if (!fs.existsSync(dbFile)) return res.json({});
    const db = readJsonSafely(dbFile);
    res.json(db);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load database ledger." });
  }
});

// Vite middleware setup and server boot
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on port ${PORT}`);
    if (supabase) {
      try {
        const { data: existingAdmin } = await supabase.from("admins").select("*").eq("id", "hassaan123").single();
        if (!existingAdmin) {
          const adminHash = await hashPassword("hassaan123");
          await supabase.from("admins").insert([{ id: "hassaan123", password_hash: adminHash }]);
          console.log("[Admin] Default admin account initialized (hassaan123 / hassaan123)");
        } else if (existingAdmin.password_hash === "$2a$10$dummy") {
          const adminHash = await hashPassword("hassaan123");
          await supabase.from("admins").update({ password_hash: adminHash }).eq("id", "hassaan123");
          console.log("[Admin] Admin password reset to default (hassaan123 / hassaan123)");
        }
      } catch (e) {
        console.warn("[Admin] Initialization failed:", e);
      }
    }
    startBackgroundWorkers();
  });
}

startServer();
