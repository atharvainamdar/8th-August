import { pickCloudLLM } from "./capabilities";
import { localCoach, localHint, localVisionGuidance } from "./providers/local";
import {
  openaiCoach,
  openaiHint,
  openaiVision,
} from "./providers/openai";
import {
  geminiCoach,
  geminiHint,
  geminiVision,
} from "./providers/gemini";
import type { CoachInput, HintInput, VisionInput } from "./types";

export async function generateTutorCoach(input: CoachInput): Promise<string> {
  const engine = pickCloudLLM();
  if (engine === "openai") {
    const text = await openaiCoach(input);
    if (text) return text;
  }
  if (engine === "gemini") {
    const text = await geminiCoach(input);
    if (text) return text;
  }
  // Try the other cloud if preferred failed
  if (engine !== "openai") {
    const text = await openaiCoach(input);
    if (text) return text;
  }
  if (engine !== "gemini") {
    const text = await geminiCoach(input);
    if (text) return text;
  }
  return localCoach(input);
}

export async function generateNextHint(input: HintInput): Promise<string> {
  const engine = pickCloudLLM();
  if (engine === "openai") {
    const text = await openaiHint(input);
    if (text) return text;
  }
  if (engine === "gemini") {
    const text = await geminiHint(input);
    if (text) return text;
  }
  if (engine !== "openai") {
    const text = await openaiHint(input);
    if (text) return text;
  }
  if (engine !== "gemini") {
    const text = await geminiHint(input);
    if (text) return text;
  }
  return localHint(input);
}

export async function analyzeHomeworkImage(
  base64: string,
  mimeType: string
): Promise<string> {
  const input: VisionInput = { base64, mimeType };
  const engine = pickCloudLLM();
  if (engine === "openai") {
    const text = await openaiVision(input);
    if (text) return text;
  }
  if (engine === "gemini") {
    const text = await geminiVision(input);
    if (text) return text;
  }
  if (engine !== "openai") {
    const text = await openaiVision(input);
    if (text) return text;
  }
  if (engine !== "gemini") {
    const text = await geminiVision(input);
    if (text) return text;
  }
  return localVisionGuidance();
}

/** Back-compat aliases */
export { generateTutorCoach as coach };
export { analyzeHomeworkImage as vision };
