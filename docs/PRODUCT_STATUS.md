# Lumi Product Status (Plan Completion)

## YC Primer wedge checklist

| Plan item | Status |
|---|---|
| Reading / Writing / Arithmetic practice | Done |
| Real adaptive engine (difficulty, scaffold, modality, sensory, interest, pacing) | Done |
| Multimodal: voice + video models + manipulatives | Done |
| Curriculum skill graph (~90–120) | Done (100 skills, 35 lessons) |
| 8-week syllabus + lessons | Done |
| Placement | Done (multi-probe R/W/M) |
| Kid UX: companion, schedule, Calm Corner, First→Then | Done |
| Progress: mastery, streaks, stars, weekly report, certificates | Done |
| Parent funnel: landing, pricing, checkout, setup, hub | Done |
| Educator share / pilot protocol | Done |
| Offline-first + optional AI keys | Done |
| Tests + smoke + simulation proof | Done |
| Durable public hosting (Vercel) | Pending secrets (`VERCEL_TOKEN`) |
| Real card billing (Stripe) | Pending secrets (Stripe keys); API ready |

## Live demo

Cloudflare tunnel URL is published in the PR description (session-bound).

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
