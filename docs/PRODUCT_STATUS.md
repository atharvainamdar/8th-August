# Lumi Product Status (Plan Completion)

## YC Primer wedge checklist

| Plan item | Status |
|---|---|
| Reading / Writing / Arithmetic practice | Done |
| Real adaptive engine (difficulty, scaffold, modality, sensory, interest, pacing) | Done |
| Multimodal: voice + video models + manipulatives | Done |
| Curriculum skill graph (~90–120) | Done (120 skills, 35 lessons) |
| 8-week syllabus + lessons | Done |
| Placement | Done (multi-probe R/W/M) |
| Kid UX: companion, schedule, Calm Corner, First→Then | Done |
| Progress: mastery, streaks, stars, weekly report, certificates | Done |
| Parent funnel: landing, pricing, checkout, setup, hub | Done |
| Educator share / pilot protocol | Done |
| Offline-first + optional AI keys | Done |
| Tests + smoke + simulation proof | Done |
| **Simplicity pass** (parent/student plain language + kid session controls) | Done |
| Durable public hosting (Vercel / Cloudflare Pages) | Pending secrets — user skipped; quick tunnel demo available |
| Real card billing (Stripe) | Pending secrets — checkout API is Stripe-ready |

## Live demo

Cloudflare quick tunnel (session-bound): check PR description / agent notes.
Local: `http://localhost:3000`

## Simplicity notes

- Landing has two clear doors: parent setup / student start
- Student home: one big Start; grown-up links tucked away
- Session: Calm Corner, Need a break, Too hard, Skip, I'm done
- Parent hub: plain-English “how practice went”

## How to verify locally

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
npm test
npm run smoke
npx tsx scripts/simulate-learners.mjs
```
