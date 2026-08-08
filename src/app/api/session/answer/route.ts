import { NextResponse } from "next/server";
import { applyResult, type SessionRuntime } from "@/lib/adaptive/session";
import { persistLearnerState } from "@/lib/db/profile";
import { prisma } from "@/lib/db/prisma";
import { generateTutorCoach } from "@/lib/ai/provider";
import { getSkill } from "@/lib/curriculum/skills";
import type { ActivityResult } from "@/lib/adaptive/types";

export async function POST(req: Request) {
  const body = await req.json();
  const runtime = body.runtime as SessionRuntime;
  const result = body.result as ActivityResult;
  const sessionId = String(body.sessionId);

  const next = applyResult(runtime, result);
  await persistLearnerState(next.state);

  await prisma.learnerEvent.create({
    data: {
      childId: next.state.childId,
      sessionId,
      type: result.skipped ? "skip" : "answer",
      payload: JSON.stringify({ result, decision: next.decision }),
    },
  });

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      itemsDone: next.itemsDone,
      adaptations: next.adaptations,
      endedAt: next.decision.action === "end_session" ? new Date() : null,
      summaryJson: JSON.stringify({
        decision: next.decision,
        regulation: next.state.regulation,
      }),
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

  return NextResponse.json({ runtime: next, coachMessage });
}
