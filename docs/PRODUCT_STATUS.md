# Lumi Product Status

## Product wedge

| Item | Status |
|---|---|
| Reading / Writing / Arithmetic practice | Done |
| Adaptive engine (mastery + policy + signals) | Done |
| Multimodal practice (voice, listen, video demos, companion) | Done |
| Curriculum (120 skills, 35 lessons) | Done |
| Placement, Calm Corner, kid session controls | Done |
| Parent hub + weekly reports | Done |
| Simplicity UX (parent/student doors) | Done |
| **Plug-and-play AI capability registry** | Done |
| **CONNECT_AI.md one-page key guide** | Done |
| Durable hosting (Vercel/Cloudflare) | Pending secrets |
| Live Stripe billing | Pending secrets |

## Offline-first MOAT

Works with **zero API keys**:
- Adaptive next-item policy + beta-binomial mastery
- Browser TTS + speech recognition
- Narrated video models
- Interest-themed local coaching + hints
- Kid agency: Calm / Too hard / Skip / I'm done

## Hot-pluggable upgrades

See `docs/CONNECT_AI.md` and `.env.example`.

| Key | Upgrade |
|---|---|
| `OPENAI_API_KEY` | Richer coach + vision |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Richer coach + vision |
| `ELEVENLABS_API_KEY` | Premium tutor voice via `/api/tts` |

Check: `GET /api/health` → `capabilities`

## Verify

```bash
npm test
npm run smoke
curl -s http://localhost:3000/api/health
```
