import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAllLessons, getWeekPlan } from "@/lib/curriculum/syllabus";
import { masteryMean } from "@/lib/adaptive/mastery";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const childId = url.searchParams.get("childId");
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  const child = await prisma.childProfile.findUnique({
    where: { id: childId },
    include: { mastery: true, lessons: true, sessions: { orderBy: { startedAt: "desc" }, take: 5 } },
  });
  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const lessons = getAllLessons();
  const done = new Set(child.lessons.filter((l) => l.status === "done").map((l) => l.lessonId));
  const nextLesson = lessons.find((l) => !done.has(l.id)) || lessons[0];

  const weak = child.mastery
    .map((m) => ({ id: m.skillId, mean: masteryMean(m) }))
    .sort((a, b) => a.mean - b.mean)
    .slice(0, 3);

  const weekIdx = Math.min(7, Math.floor(done.size / 4));
  const week = getWeekPlan()[weekIdx];

  return NextResponse.json({
    child: {
      id: child.id,
      displayName: child.displayName,
      streakDays: child.streakDays,
      stars: child.stars,
      interestPack: child.interestPack,
    },
    week,
    nextLesson,
    weakSkills: weak,
    recentSessions: child.sessions.length,
    recommendation: `Today: ${nextLesson?.title ?? "Practice"} (${nextLesson?.minutes ?? 12} min)`,
  });
}
