import { NextResponse } from "next/server";
import { getProfile, progressSummary } from "@/lib/db/profile";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const progress = await progressSummary(id);
  return NextResponse.json({ profile, progress });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const profile = await prisma.childProfile.update({
    where: { id },
    data: {
      sensoryMode: body.sensoryMode,
      interestPack: body.interestPack,
      dyslexiaFont: body.dyslexiaFont,
      soundEnabled: body.soundEnabled,
      motionEnabled: body.motionEnabled,
      celebrationLevel: body.celebrationLevel,
      sessionMinutes: body.sessionMinutes,
      placed: body.placed,
    },
  });
  return NextResponse.json({ profile });
}
