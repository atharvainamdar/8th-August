import { NextResponse } from "next/server";
import { elevenLabsReady, elevenLabsTTS } from "@/lib/ai/providers/elevenlabs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { text?: string };
  const text = String(body.text || "").trim().slice(0, 500);
  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  if (!elevenLabsReady()) {
    return NextResponse.json({ engine: "local", audio: null });
  }

  const result = await elevenLabsTTS(text);
  if (!result) {
    return NextResponse.json({ engine: "local", audio: null });
  }

  return new NextResponse(result.audio, {
    headers: {
      "Content-Type": result.contentType,
      "Cache-Control": "no-store",
      "X-Lumi-TTS-Engine": "elevenlabs",
    },
  });
}
