# Lumi — Adaptive AI Tutor for Autistic Kids (YC Primer Wedge)

Lumi is a one-on-one multimodal AI tutor for autistic / neurodivergent kids ages **7–10**, focused on **reading, writing, and arithmetic** homework practice.

It is built as a **YC Fall 2026 “The Primer” wedge**: start with the learners generic tutors fail, prove measurable practice growth, then expand toward a full Primer.

> Educational practice tool. Not clinical diagnosis or therapy.

## Features

- Real adaptive engine: difficulty, scaffold, modality, sensory mode, pacing, special interests
- Reading: phonics, blending, decoding, fluency, comprehension
- Writing: letter tracing, Cover-Copy-Compare spelling, sentence frames, short responses, speak-to-write
- Math: number sense, ten-frames, operations, fact fluency, schema word problems
- Calm Corner, visual schedule, transition warnings
- Companion character Lumi
- Adult/educator dashboard + JSON/CSV export
- Works offline with browser TTS/STT; OpenAI/Gemini enhance coaching + homework vision

## Quick start

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo profiles: **Ava** (calm/trains), **Leo** (balanced/dinos), **Sam** (bright/space).

### Optional AI keys

Lumi is **offline-first**. Adaptive reading/writing/math, browser TTS/STT, Calm Corner, mastery tracking, and educator export all work with **no cloud AI keys**.

If you later add keys (optional), coaching lines and homework photo help get richer:

```bash
# in .env — all optional
OPENAI_API_KEY=...
# or
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## Scripts

- `npm run dev` — local app
- `npm test` — adaptive engine + simulation tests
- `npm run db:seed` — seed demo learners
- `npm run build` — production build

## Docs

- `docs/RESEARCH.md` — research foundations & competitor notes
- `docs/CURRICULUM.md` — skill graph overview
- `docs/PILOT_PROTOCOL.md` — specialist testing protocol
- `docs/YC_DEMO_SCRIPT.md` — investor demo path
- In-app: `/demo`, `/docs/pilot`

## Stack

Next.js 15 · TypeScript · Tailwind · Prisma/SQLite · Vitest · Zustand
