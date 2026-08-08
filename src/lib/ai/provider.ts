export type AIProviderName = "openai" | "gemini" | "none";

export function detectProvider(): AIProviderName {
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "gemini";
  return "none";
}

export function hasAI(): boolean {
  return detectProvider() !== "none";
}

export async function generateTutorCoach(input: {
  childName: string;
  skillTitle: string;
  modality: string;
  scaffold: string;
  correct: boolean;
  interest: string;
  errorNote?: string;
}): Promise<string> {
  const provider = detectProvider();
  const fallback = input.correct
    ? `Nice work, ${input.childName}. You used a clear strategy on ${input.skillTitle}.`
    : `That was a good try, ${input.childName}. Let's look at one small step together.`;

  if (provider === "none") return fallback;

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
    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.4,
          max_tokens: 80,
        }),
      });
      if (!res.ok) return fallback;
      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      return json.choices?.[0]?.message?.content?.trim() || fallback;
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${system}\n\n${user}` }] }],
        }),
      }
    );
    if (!res.ok) return fallback;
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallback;
  } catch {
    return fallback;
  }
}

export async function analyzeHomeworkImage(base64: string, mimeType: string): Promise<string> {
  const provider = detectProvider();
  if (provider === "none") {
    return "I can look at homework when an AI key is connected. For now, tell me which problem feels hard and we will solve one step at a time.";
  }

  const prompt =
    "You are Lumi, helping an autistic child ages 7-10 with homework. Describe what you see in one short sentence, then give the first small step only. Do not dump the full answer. Be literal and kind.";

  try {
    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
              ],
            },
          ],
          max_tokens: 160,
        }),
      });
      if (!res.ok) return "I could not read that image. Try a clearer photo.";
      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      return json.choices?.[0]?.message?.content?.trim() || "Let's try one step together.";
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: base64 } },
              ],
            },
          ],
        }),
      }
    );
    if (!res.ok) return "I could not read that image. Try a clearer photo.";
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Let's try one step together.";
  } catch {
    return "Something went wrong reading the photo. We can still practice with Lumi activities.";
  }
}
