import type { CapabilityStatus, EngineName } from "./types";
import { openaiReady } from "./providers/openai";
import { geminiReady } from "./providers/gemini";
import { elevenLabsReady } from "./providers/elevenlabs";

export type PreferredProvider = "auto" | "openai" | "gemini";

export function preferredProvider(): PreferredProvider {
  const raw = (process.env.AI_PREFERRED_PROVIDER || "auto").toLowerCase();
  if (raw === "openai" || raw === "gemini") return raw;
  return "auto";
}

export function pickCloudLLM(): EngineName {
  const pref = preferredProvider();
  if (pref === "openai" && openaiReady()) return "openai";
  if (pref === "gemini" && geminiReady()) return "gemini";
  if (openaiReady()) return "openai";
  if (geminiReady()) return "gemini";
  return "local";
}

export function listCapabilities(): CapabilityStatus[] {
  const llm = pickCloudLLM();
  const tts: EngineName = elevenLabsReady() ? "elevenlabs" : "local";
  return [
    {
      id: "coach",
      label: "Tutor coach",
      engine: llm,
      ready: true,
      detail:
        llm === "local"
          ? "Built-in calm coaching (works offline)"
          : `Connected via ${llm}`,
    },
    {
      id: "hint",
      label: "Smart hints",
      engine: llm,
      ready: true,
      detail:
        llm === "local"
          ? "Built-in step hints when practice gets hard"
          : `Connected via ${llm}`,
    },
    {
      id: "vision",
      label: "Homework photo help",
      engine: llm === "local" ? "local" : llm,
      ready: true,
      detail:
        llm === "local"
          ? "Built-in guided worksheet help"
          : `Vision connected via ${llm}`,
    },
    {
      id: "tts",
      label: "Tutor voice",
      engine: tts,
      ready: true,
      detail:
        tts === "local"
          ? "Built-in browser voice"
          : "Premium voice via ElevenLabs",
    },
    {
      id: "stt",
      label: "Listen / read-aloud",
      engine: "local",
      ready: true,
      detail: "Built-in speech recognition in supported browsers",
    },
  ];
}

export function capabilitySummary() {
  const caps = listCapabilities();
  return {
    adaptiveCore: "local",
    capabilities: caps,
    cloudLlm: pickCloudLLM(),
    elevenLabs: elevenLabsReady(),
    openai: openaiReady(),
    gemini: geminiReady(),
  };
}
