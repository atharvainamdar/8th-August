function key() {
  return process.env.ELEVENLABS_API_KEY || "";
}

export function elevenLabsReady() {
  return Boolean(key());
}

export async function elevenLabsTTS(
  text: string
): Promise<{ audio: ArrayBuffer; contentType: string } | null> {
  if (!elevenLabsReady()) return null;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key(),
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: process.env.ELEVENLABS_MODEL || "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.7,
            style: 0.2,
          },
        }),
      }
    );
    if (!res.ok) return null;
    const audio = await res.arrayBuffer();
    return { audio, contentType: res.headers.get("content-type") || "audio/mpeg" };
  } catch {
    return null;
  }
}
