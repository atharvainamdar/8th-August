# Connect AI engines to Lumi (3 minutes)

Lumi already works **without any API keys**.  
The adaptive brain, voice practice, video models, Calm Corner, and progress tracking are built-in.

When you add keys, the **same screens** get smarter. No code rewrite.

---

## Quick start

1. Copy `.env.example` → `.env` (if you don’t already have `.env`).
2. Paste a key on the matching line (remove the `#`).
3. Restart the app: stop `npm run dev`, then run it again.
4. Check engines: open `/api/health` — look at `capabilities`.

---

## What each key unlocks

| Paste this key | What gets better |
|---|---|
| `OPENAI_API_KEY` | Richer tutor coaching lines + homework photo understanding |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Same as OpenAI (Gemini). Use either or both |
| `AI_PREFERRED_PROVIDER=openai` or `gemini` | Force which LLM wins if both keys exist (`auto` default) |
| `ELEVENLABS_API_KEY` | Premium spoken tutor voice (instead of browser voice) |
| `ELEVENLABS_VOICE_ID` | Optional: pick a specific ElevenLabs voice |

Still optional later:
- `VERCEL_TOKEN` / `CLOUDFLARE_API_TOKEN` → durable hosting  
- Stripe keys → card checkout  

---

## Always-on (no keys)

These never need cloud APIs:

- Adaptive mastery + next-activity policy  
- Scaffold / modality switching when a child struggles  
- Browser TTS + speech recognition (Chrome/Edge best)  
- Video model demos + Lumi companion  
- Calm Corner, streaks, weekly reports  

---

## Verify it worked

```bash
curl -s http://localhost:3000/api/health | jq .capabilities
```

Or open Parent hub → **Lumi engines**.

- `engine: "local"` → built-in path (still fully usable)  
- `engine: "openai" | "gemini" | "elevenlabs"` → cloud connected  

---

## Safety notes

- Keys stay on the **server** (`.env`). Never put secret keys in `NEXT_PUBLIC_*`.  
- TTS uses `/api/tts` so the ElevenLabs key is never sent to the browser.  
- Kids never see “missing API key” messages.

---

## Recommended starter combo (when you’re ready)

1. `OPENAI_API_KEY` — coach + vision  
2. `ELEVENLABS_API_KEY` — warm tutor voice  

That’s enough to feel “premium multimodal” in a pilot.
