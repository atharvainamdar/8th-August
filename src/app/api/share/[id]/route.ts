import { NextResponse } from "next/server";
import { getProfile, progressSummary } from "@/lib/db/profile";
import { masteryMean } from "@/lib/adaptive/mastery";

/** Read-only educator/parent share snapshot (no mutation endpoints). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const progress = await progressSummary(id);
  return NextResponse.json({
    kind: "lumi-share-v1",
    generatedAt: new Date().toISOString(),
    note: "Read-only educational practice snapshot. Not a clinical assessment.",
    child: {
      displayName: profile.displayName,
      ageBand: profile.ageBand,
      interestPack: profile.interestPack,
      sensoryMode: profile.sensoryMode,
      streakDays: profile.streakDays,
      stars: profile.stars,
      totalMinutes: profile.totalMinutes,
    },
    progress,
    topSkills: profile.mastery
      .map((m) => ({ id: m.skillId, mean: masteryMean(m) }))
      .sort((a, b) => b.mean - a.mean)
      .slice(0, 8),
    recentSessions: profile.sessions.slice(0, 10).map((s) => ({
      domain: s.domain,
      itemsDone: s.itemsDone,
      adaptations: s.adaptations,
      startedAt: s.startedAt,
    })),
  });
}
