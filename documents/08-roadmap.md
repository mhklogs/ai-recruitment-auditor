# AI Recruitment Auditor — Delivery Roadmap (v3)

> **Provenance note.** This roadmap was produced on **2026-09-29** from the same
> static analysis as the rest of `documents/` (see `00-index.md`). Backlog items are
> derived from the functional requirements in `02-functional-requirements.md`, the
> non-functional targets in `03-non-functional-requirements.md`, and the market
> findings in `01-market-analysis.md`. Timeline targets are `[TO BE VALIDATED]`
> where they depend on future estimates rather than shipped code.

## 1. Objective & horizon

Recruitment audit portal + hiring review. This roadmap plans the next **5–6 weeks** of incremental delivery in
lockstep with the SDLC phases and traceability rules in `07-sdlc-lifecycle.md`
(Requirements → Design → Implement → Verify → Release/Operate → Improve).

Current shipped state: `https://ai-recruitment-auditor.vercel.app` (production), source committed, v2 documentation set complete.
The build is a Vite + React + Tailwind SPA with 12 component modules, a Node
fullstack server (`server.ts`) and a Vercel serverless entry (`api/index.ts`),
Supabase for lead storage, and Gemini for the behavioral report — with a documented
rule-based fallback when no API key is present. Fifteen environment variables are
referenced; `06-architecture.md` records no auth layer.

## 2. Product backlog

Prioritised with MoSCoW. Items are phrased as outcomes (not tasks) and map to FR/NFR ids.

| ID | Item (outcome) | Source | Priority |
| --- | --- | --- | --- |
| PBI-01 | Every one of the 15 referenced environment variables is validated at startup with a clear, named error — including `SUPABASE_SERVICE_ROLE_KEY`, which must never reach the browser bundle | FR-8, NFR-5.2 | Must |
| PBI-02 | Leads and plans persist durably; a lead write is not reported successful until Supabase confirms it | FR-7 | Must |
| PBI-03 | An access boundary guards the audit portal and proctored screening; unauthenticated users cannot read another company's audit or a candidate's screening | market gap / `01-market-analysis.md` §6 | Must |
| PBI-04 | The AI behavioral report either conforms to a declared schema or fails with an explicit error — never a half-written report presented as final | FR-5 | Must |
| PBI-05 | The service-role key cannot be bundled into the client build; a bundle-content check runs in CI | NFR-5.2, NFR-5.1 | Must |
| PBI-06 | Every report records model, prompt version, and token usage, so an audit's AI cost and provenance are attributable | FR-5 (inferred) | Should |
| PBI-07 | The rule-based offline fallback is explicit in the UI — a user can never mistake a fallback diagnostic for a Gemini-written report | FR-5 | Should |
| PBI-08 | The proctored screening portal validates its lockdown-detection input and handles a bypassed or unsupported browser with a typed error | NFR-5.4 | Should |
| PBI-09 | Rate limiting on the public audit and lead-capture endpoints | NFR-5.5 | Should |
| PBI-10 | Prompt-injection exposure of the report-generation path is assessed and documented | NFR-4.4 | Should |
| PBI-11 | Personal data handled by the proctored screening path has a documented retention and deletion policy | NFR-5.7 | Should |
| PBI-12 | Provider outage or timeout returns a typed error and falls back cleanly, with an explicit timeout and retry budget | NFR-4.1 | Should |
| PBI-13 | The 12 component modules render without server-side state leaking between routes, covered by the existing test suite | FR-3, NFR-6.1 | Should |
| PBI-14 | CI runs the existing tests, type check, and lint on every push; coverage is measured rather than assumed | NFR-6.1, NFR-6.3, NFR-6.2 | Should |
| PBI-15 | `npm audit` is run and recorded against the Vite/React/Express dependency set | NFR-5.3 | Should |
| PBI-16 | Audit findings cite the specific evidence in the reviewed pipeline, so a hiring manager can verify each recommendation | market differentiator (§6) | Could |
| PBI-17 | An audit report records its own bias and coverage limitations, so the product does not imply a fairness guarantee it has not measured | market differentiator (§6) | Could |
| PBI-18 | Latency and cold-start figures measured against NFR-1 targets | NFR-1.1, NFR-1.5 | Won't (this horizon) |

## 3. Sprint plan

**Sprint cadence:** 1 week = 1 sprint; stand-up daily (15 min), sprint review + retrospective at the end of each sprint.

| Sprint | Goal | PBI delivered | Done/exit criteria | Phase (SDLC) |
| --- | --- | --- | --- | --- |
| Sprint 1 | Lock down configuration and secrets | PBI-01, PBI-05 | all 15 env vars validated with named errors; CI fails if a service-role key appears in the client bundle | Implement → Verify |
| Sprint 2 | Make the data path trustworthy | PBI-02, PBI-09 | failed lead writes are retried or surfaced, never reported as success; endpoints rate limited | Implement → Verify |
| Sprint 3 | Put the portal behind an access boundary | PBI-03 | an unauthenticated request cannot read an audit or a screening result | Implement → Verify |
| Sprint 4 | Make the AI report honest and attributable | PBI-04, PBI-06, PBI-07 | report validates against a declared schema; model, prompt version and token usage retrievable; fallback visibly labelled in the UI | Verify |
| Sprint 5 | Harden the screening and report paths | PBI-08, PBI-10, PBI-11, PBI-12 | unsupported or bypassed browser yields a typed error; injection scenarios exercised; retention policy written; provider failure falls back cleanly | Verify |
| Sprint 6 | Test, pipeline, and cut a release | PBI-13, PBI-14, PBI-15, PBI-16, PBI-17, backlog refinement | CI green on every push with measured coverage; release cut to `https://ai-recruitment-auditor.vercel.app` | Release & Operate → Improve |

## 4. Ceremonies

- **Daily stand-up (15 min):** what shipped since yesterday, what's blocked, what's next — tied to the active sprint's PBI board.
- **Sprint review (30 min, end of sprint):** demo PBI outcomes against the sprint goal; update `05-use-cases.md` walkthrough where behavior changed.
- **Retrospective (30 min, end of sprint):** inspect + adapt; record one actionable improvement per sprint in git notes.
- **Backlog refinement (before sprint 1):** re-prioritise PBIs against latest market findings.

## 5. Burndown (planned)

Tracked as PBI points remaining per sprint. Planned trajectory below; the team records actuals at each sprint review. `[TO BE MEASURED]` until the first sprint completes.

| Sprint | Planned remaining points |
| --- | --- |
| Start | 18 |
| Sprint 1 | 16 |
| Sprint 2 | 14 |
| Sprint 3 | 12 |
| Sprint 4 | 10 |
| Sprint 5 | 6 |
| Sprint 6 (Done, 0) | 0 |

## 6. Rollout & deploy

- Build/deploy per `07-sdlc-lifecycle.md` §5 (release policy).
- Production: `https://ai-recruitment-auditor.vercel.app` — Vercel, with `/api/*`
  routed to the `api/index.ts` serverless entry. `npm run build && node dist/server.cjs`
  is the fullstack local path.
- Health: a broken build blocks the next sprint's first commit; security findings are release blockers.

## 7. Risks

| Risk | Mitigation |
| --- | --- |
| Requirements drift vs. implemented code | PBI↔FR↔use-case traceability check per change (`07-sdlc-lifecycle.md` §3) |
| Unmeasured NFRs treated as done | `[TO BE MEASURED]` targets stay visible until instrumented |
| Burndown actuals fall off plan | Over-plan cut scope in the retrospective, not mid-sprint |
| Service-role key leaking into the client bundle | PBI-01 + PBI-05; a bundle check is a release blocker |
| Rule-based fallback read as a real AI audit | PBI-07 makes the fallback explicit in the UI |
| No auth layer on a live public URL holding company and candidate data | PBI-03 is a release blocker for new customer data |
| Crowded ATS market with no defensible position today (`01-market-analysis.md` §6) | PBI-16 and PBI-17 build the citable, self-limiting audit that the incumbents do not offer |
