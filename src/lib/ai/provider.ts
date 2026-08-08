/**
 * Public AI facade — prefer importing from `@/lib/ai/registry`.
 * Kept for backward compatibility with existing API routes.
 */
export {
  generateTutorCoach,
  analyzeHomeworkImage,
  generateNextHint,
} from "./registry";

export { capabilitySummary, listCapabilities, pickCloudLLM } from "./capabilities";

export type AIProviderName = "openai" | "gemini" | "none";

export function detectProvider(): AIProviderName {
  const llm = pickCloudLLMSafe();
  if (llm === "openai" || llm === "gemini") return llm;
  return "none";
}

export function hasAI(): boolean {
  return detectProvider() !== "none";
}

function pickCloudLLMSafe(): "openai" | "gemini" | "local" {
  // Lazy require pattern avoided — import at top would cycle; inline detect:
  const openai = Boolean(process.env.OPENAI_API_KEY);
  const gemini = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const pref = (process.env.AI_PREFERRED_PROVIDER || "auto").toLowerCase();
  if (pref === "openai" && openai) return "openai";
  if (pref === "gemini" && gemini) return "gemini";
  if (openai) return "openai";
  if (gemini) return "gemini";
  return "local";
}
