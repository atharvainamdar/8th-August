import type { CoachInput, HintInput, VisionInput } from "../types";

function key() {
  return process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
}

export function geminiReady() {
  return Boolean(key());
}

async function geminiText(prompt: string): Promise<string | null> {
  if (!geminiReady()) return null;
  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

export async function geminiCoach(input: CoachInput): Promise<string | null> {
  const system = `You are Lumi, a calm one-on-one tutor for autistic kids ages 7-10.
Rules: literal language, no idioms, no sarcasm, never shame, never claim to be therapy.
Keep replies to 1-2 short sentences. Theme: ${input.interest}.`;
  const user = `Child: ${input.childName}
Skill: ${input.skillTitle}
Modality: ${input.modality}
Scaffold: ${input.scaffold}
Result: ${input.correct ? "correct" : "incorrect"}
${input.errorNote ? `Note: ${input.errorNote}` : ""}
Write a brief coaching line.`;
  return geminiText(`${system}\n\n${user}`);
}

export async function geminiHint(input: HintInput): Promise<string | null> {
  return geminiText(
    `You are Lumi. ONE tiny next hint for autistic child 7-10. No full answer. Max 2 sentences.
Child ${input.childName}, skill ${input.skillTitle}, scaffold ${input.scaffold}, modality ${input.modality}, interest ${input.interest}. Last: ${input.lastResponse || "none"}.`
  );
}

export async function geminiVision(input: VisionInput): Promise<string | null> {
  if (!geminiReady()) return null;
  const prompt =
    "You are Lumi, helping an autistic child ages 7-10 with homework. Describe what you see in one short sentence, then give the first small step only. Do not dump the full answer. Be literal and kind.";
  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { inline_data: { mime_type: input.mimeType, data: input.base64 } },
              ],
            },
          ],
        }),
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}
