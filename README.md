# Lumi — Adaptive AI Tutor for Autistic Kids (YC Primer Wedge)

Lumi is a **parent-sellable** one-on-one multimodal AI tutor for autistic / neurodivergent kids ages **7–10**, focused on **reading, writing, and arithmetic**.

Built as a **YC Fall 2026 “The Primer” wedge**: start where generic tutors fail, prove measurable practice growth, expand toward a full Primer.

> Educational practice tool. Not clinical diagnosis or therapy.

## Product surfaces

| URL | Who | Purpose |
|---|---|---|
| `/` | Parents | Marketing site, pricing, CTA |
| `/setup` | Parents | Parent email + child profile + plan |
| `/app` | Students | Kid home, mood check, start practice |
| `/learn` | Students | Live adaptive session (voice, video models, Calm Corner) |
| `/syllabus` | Parents/educators | Full 8-week syllabus |
| `/parents` | Parents | Streaks, mastery, weekly report, exports |
| `/certificate/[id]` | Families | Practice certificate |
| `/demo` | Investors | YC demo script |

## Features

- Real adaptive engine: difficulty, scaffold, modality, sensory mode, pacing, special interests
- 8-week skill-based syllabus across reading, writing, math
- Expanded content banks (phonics, fluency, spelling, operations, word problems)
- Voice practice (TTS + speak-to-answer / read-aloud scoring)
- Animated video models (letters, blending, ten-frames, equal groups)
- Calm Corner, visual schedule, First→Then, stars + streaks
- Parent hub + weekly HTML report + JSON/CSV export
- Offline-first (works without AI keys); OpenAI/Gemini optional for richer coaching/vision

## Quick start

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo: **Ava** (calm/trains), **Leo** (balanced/dinos), **Sam** (bright/space).

### Optional AI keys

```bash
# .env — optional
OPENAI_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

## Pricing (productized)

- Free trial: $0 / 7 days
- Monthly: $29/mo
- Yearly: $199/yr

(Stripe can be wired later; trial unlocks full experience now.)

## Scripts

- `npm run dev` — local app
- `npm test` — adaptive engine tests
- `npm run db:seed` — demo parent + children
- `npm run build` — production build
- `npm run smoke` — route smoke checks against local server
- `npm run simulate` — adaptive vs fixed learner simulation → `docs/sim-results.json`

## Status

See `docs/PRODUCT_STATUS.md` and `CHANGELOG.md`.

## Docs

- `docs/RESEARCH.md`
- `docs/CURRICULUM.md`
- `docs/PILOT_PROTOCOL.md`
- `docs/YC_DEMO_SCRIPT.md`
