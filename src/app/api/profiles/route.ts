import { NextResponse } from "next/server";
import { createProfile, listProfiles } from "@/lib/db/profile";
import type { InterestPack, SensoryMode } from "@/lib/adaptive/types";

export async function GET() {
  const profiles = await listProfiles();
  return NextResponse.json({ profiles });
}

export async function POST(req: Request) {
  const body = await req.json();
  const profile = await createProfile({
    displayName: String(body.displayName || "Friend"),
    ageBand: String(body.ageBand || "7-8"),
    sensoryMode: (body.sensoryMode || "balanced") as SensoryMode,
    interestPack: (body.interestPack || "space") as InterestPack,
    dyslexiaFont: Boolean(body.dyslexiaFont),
    soundEnabled: body.soundEnabled !== false,
    motionEnabled: body.motionEnabled !== false,
    celebrationLevel: body.celebrationLevel || "medium",
    sessionMinutes: Number(body.sessionMinutes || 15),
  });
  return NextResponse.json({ profile });
}
