import { NextResponse } from "next/server";
import { startSession } from "@/lib/adaptive/session";
import { learnerStateFromProfile } from "@/lib/db/profile";
import { prisma } from "@/lib/db/prisma";
import type { Domain } from "@/lib/adaptive/types";
import { getLesson, getUnitForLesson } from "@/lib/curriculum/syllabus";

export async function POST(req: Request) {
  const body = await req.json();
  const childId = String(body.childId);
  let domain = body.domain as Domain | undefined;
  const placement = Boolean(body.placement);
  const lessonId = body.lessonId ? String(body.lessonId) : undefined;

  if (lessonId) {
    const unit = getUnitForLesson(lessonId);
    if (unit?.domain === "reading" || unit?.domain === "writing" || unit?.domain === "math") {
      domain = unit.domain;
    }
    const lesson = getLesson(lessonId);
    if (lesson) {
      await prisma.lessonProgress.upsert({
        where: { childId_lessonId: { childId, lessonId } },
        create: {
          childId,
          lessonId,
          unitId: unit?.id || "unit.mixed.1",
          status: "available",
        },
        update: { status: "available" },
      });
    }
  }

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
      summaryJson: JSON.stringify({ decision: runtime.decision, lessonId }),
    },
  });
  return NextResponse.json({ sessionId: session.id, runtime, lessonId });
}
