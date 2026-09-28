# ai-recruitment-auditor — Architecture Summary

> Generated from static analysis on 2026-09-28.

## Components

| Layer | Present | Evidence |
| --- | --- | --- |
| Presentation / UI | yes | 0 route module(s), 12 component file(s) |
| API / server | yes | 0 handler(s), entrypoints: api/index.ts, server.ts |
| Domain / business logic | unclear | no dedicated layer detected |
| Persistence | yes | @supabase/supabase-js |
| Authentication | no | none detected |

## Detected frameworks and libraries

| Package | Purpose (inferred) |
| --- | --- |
| `@google/genai` | dependency |
| `@supabase/supabase-js` | Supabase |
| `@tailwindcss/vite` | dependency |
| `@types/bcryptjs` | dependency |
| `@types/express` | dependency |
| `@types/node` | dependency |
| `@vitejs/plugin-react` | dependency |
| `autoprefixer` | dependency |
| `bcryptjs` | dependency |
| `dotenv` | dependency |
| `esbuild` | esbuild |
| `express` | Express |
| `lucide-react` | dependency |
| `motion` | dependency |
| `react` | React |
| `react-dom` | React |
| `react-router-dom` | dependency |
| `tailwindcss` | Tailwind CSS |
| `tsx` | dependency |
| `typescript` | dependency |
| `vite` | Vite |
| `ws` | dependency |

## Runtime and delivery

| Concern | Finding |
| --- | --- |
| Language mix | TypeScript, SQL, HTML, CSS |
| Package manager | npm |
| Container | none |
| Serverless / PaaS | Vercel configuration present |
| CI | none detected |
| Tests | present |
| Type safety | TypeScript |

## Environment variables referenced

- `APP_MODE`
- `APP_URL`
- `DISABLE_HMR`
- `EMAIL_FROM`
- `EMAIL_FROM_NAME`
- `GEMINI_API_KEY`
- `NODE_ENV`
- `PORT`
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL`
- `TEST_PORTAL_URL`
- `VERCEL`
- `VERCEL_URL`
- `VITE_SUPABASE_URL`
