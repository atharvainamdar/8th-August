import { NextResponse } from "next/server";
import { startSession } from "@/lib/adaptive/session";
import { learnerStateFromProfile } from "@/lib/db/profile";
import { prisma } from "@/lib/db/prisma";
import type { Domain } from "@/lib/adaptive/types";

export async function POST(req: Request) {
  const body = await req.json();
  const childId = String(body.childId);
  const domain = body.domain as Domain | undefined;
  const placement = Boolean(body.placement);
  const state = await learnerStateFromProfile(childId);
  if (body.mood) {
    state.regulation = body.mood === "hard" ? "stressed" : body.mood === "great" ? "calm" : "ok";
  }
  const runtime = startSession(state, { domain, placement });
  const session = await prisma.session.create({
    data: {
      childId,
      domain: runtime.domain,
      moodStart: body.mood || null,
      itemsPlanned: runtime.itemsPlanned,
      summaryJson: JSON.stringify({ decision: runtime.decision }),
    },
  });
  return NextResponse.json({ sessionId: session.id, runtime });
}
