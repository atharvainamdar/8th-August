import type { CoachInput, HintInput, VisionInput } from "../types";

function key() {
  return process.env.OPENAI_API_KEY || "";
}

export function openaiReady() {
  return Boolean(key());
}

export async function openaiCoach(input: CoachInput): Promise<string | null> {
  if (!openaiReady()) return null;
  const system = `You are Lumi, a calm one-on-one tutor for autistic kids ages 7-10.
Rules: literal language, no idioms, no sarcasm, never shame, never claim to be therapy.
Keep replies to 1-2 short sentences. Celebrate effort and strategies. Theme: ${input.interest}.`;
  const user = `Child: ${input.childName}
Skill: ${input.skillTitle}
Modality: ${input.modality}
Scaffold: ${input.scaffold}
Result: ${input.correct ? "correct" : "incorrect"}
${input.errorNote ? `Note: ${input.errorNote}` : ""}
Write a brief coaching line.`;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.4,
        max_tokens: 80,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return json.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function openaiHint(input: HintInput): Promise<string | null> {
  if (!openaiReady()) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Lumi. Give ONE tiny next hint for an autistic child 7-10. No full answers. Literal, kind, max 2 sentences.",
          },
          {
            role: "user",
            content: `Child ${input.childName}, skill ${input.skillTitle}, scaffold ${input.scaffold}, modality ${input.modality}, interest ${input.interest}. Last response: ${input.lastResponse || "none"}. Hint:`,
          },
        ],
        temperature: 0.3,
        max_tokens: 70,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return json.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function openaiVision(input: VisionInput): Promise<string | null> {
  if (!openaiReady()) return null;
  const prompt =
    "You are Lumi, helping an autistic child ages 7-10 with homework. Describe what you see in one short sentence, then give the first small step only. Do not dump the full answer. Be literal and kind.";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${input.mimeType};base64,${input.base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 160,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return json.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
