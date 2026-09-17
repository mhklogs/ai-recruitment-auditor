# AI Recruitment Auditor

B2B recruitment-audit SaaS — a single portal that audits hiring pipelines and hiring managers with proctored screening, AI-written behavioral reports, and a plan/pricing layer that persists leads.

## Features

- **Recruitment audit wizard** — runs a structured hiring-process review and generates an AI behavioral report (Gemini).
- **Proctored screening portal** — unified online-assessment experience with browser lockdown detection.
- **B2B plan selector** — custom plans computed from company size + role mix; lead information persisted to Supabase.
- **Graceful degradation** — with no API key, the app generates offline rule-based diagnostics instead of erroring.

## Tech stack

- Vite + React, Tailwind
- Node HTTP server (`server.ts` — run for local/fullstack flows)
- Supabase (lead storage), Gemini API (reports)
- Deployable to Vercel (`vercel.json` configured)

## Run locally

```bash
npm install
cp .env.example .env.local   # (or create manually, see below)
npm run dev                  # Vite dev server
# Fullstack server:
npm run build && node dist/server.cjs
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | for AI | Gemini API key (AI reports). Missing → rule-based fallback |
| `SUPABASE_URL` | for leads | Supabase project URL |
| `SUPABASE_ANON_KEY` | for leads | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | for leads | service-role key (server-side writes) |
| `SUPABASE_JWT_SECRET` | optional | for signed follow-ups |

## Database

`supabase-schema.sql` — tables for leads/plans; `supabase-test-schema.sql` — test fixtures.

## Deploy

```bash
vercel deploy --prod
```

Route `/api/*` is handled by the Node serverless entry (`api/index.ts`).

## Repo layout

```
index.html, src/       # SPA
server.ts              # fullstack Node server
api/                   # Vercel serverless entry
supabase-*.sql         # schema + fixtures
supabase/              # migration helpers
vault/                 # internal resources
documents/             # marketing/guides (RecruitAI PDF)
```