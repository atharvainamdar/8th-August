import { NextResponse } from "next/server";
import { applyResult, type SessionRuntime } from "@/lib/adaptive/session";
import { persistLearnerState } from "@/lib/db/profile";
import { prisma } from "@/lib/db/prisma";
import { generateTutorCoach } from "@/lib/ai/provider";
import { getSkill } from "@/lib/curriculum/skills";
import type { ActivityResult } from "@/lib/adaptive/types";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  const body = await req.json();
  const runtime = body.runtime as SessionRuntime;
  const result = body.result as ActivityResult;
  const sessionId = String(body.sessionId);

  const next = applyResult(runtime, result);
  await persistLearnerState(next.state);

  const starsEarned = result.correct ? (result.hintsUsed > 0 ? 1 : 2) : 0;

  await prisma.learnerEvent.create({
    data: {
      childId: next.state.childId,
      sessionId,
      type: result.skipped ? "skip" : "answer",
      payload: JSON.stringify({ result, decision: next.decision, starsEarned }),
    },
  });

  const ended = next.decision.action === "end_session";
  const session = await prisma.session.update({
    where: { id: sessionId },
    data: {
      itemsDone: next.itemsDone,
      adaptations: next.adaptations,
      starsEarned: { increment: starsEarned },
      endedAt: ended ? new Date() : null,
      summaryJson: JSON.stringify({
        decision: next.decision,
        regulation: next.state.regulation,
      }),
    },
  });

  const child = await prisma.childProfile.findUniqueOrThrow({
    where: { id: next.state.childId },
  });
  const today = todayKey();
  let streakDays = child.streakDays;
  if (child.lastPracticeDate !== today) {
    streakDays = child.lastPracticeDate === yesterdayKey() ? child.streakDays + 1 : 1;
  }
  const bestStreak = Math.max(child.bestStreak, streakDays);
  const minutesBump = ended ? Math.max(5, Math.round((child.sessionMinutes / Math.max(1, next.itemsPlanned)) * next.itemsDone)) : 0;

  await prisma.childProfile.update({
    where: { id: child.id },
    data: {
      stars: { increment: starsEarned },
      streakDays,
      bestStreak,
      lastPracticeDate: today,
      totalMinutes: ended ? child.totalMinutes + minutesBump : child.totalMinutes,
    },
  });

  const skill = getSkill(result.skillId);
  const coachMessage = await generateTutorCoach({
    childName: next.state.displayName,
    skillTitle: skill.title,
    modality: result.modality,
    scaffold: result.scaffold,
    correct: result.correct,
    interest: next.state.interestPack,
    errorNote: result.correct ? undefined : `Response was ${result.response ?? "blank"}`,
  });

  return NextResponse.json({
    runtime: next,
    coachMessage,
    starsEarned,
    streakDays,
    sessionStars: session.starsEarned + starsEarned,
  });
}
