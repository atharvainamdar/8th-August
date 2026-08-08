import { NextResponse } from "next/server";
import { getProfile, progressSummary } from "@/lib/db/profile";
import { prisma } from "@/lib/db/prisma";
import { masteryMean } from "@/lib/adaptive/mastery";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "json";
  const profile = await getProfile(id);
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const progress = await progressSummary(id);
  const events = await prisma.learnerEvent.findMany({
    where: { childId: id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const report = {
    generatedAt: new Date().toISOString(),
    child: {
      id: profile.id,
      name: profile.displayName,
      ageBand: profile.ageBand,
      sensoryMode: profile.sensoryMode,
      interestPack: profile.interestPack,
    },
    progress,
    mastery: profile.mastery.map((m) => ({
      skillId: m.skillId,
      mean: masteryMean(m),
      alpha: m.alpha,
      beta: m.beta,
    })),
    sessions: profile.sessions,
    recentEvents: events,
    note: "Educational practice report. Not a clinical assessment.",
  };

  if (format === "csv") {
    const lines = [
      "skillId,mastery",
      ...report.mastery.map((m) => `${m.skillId},${m.mean.toFixed(3)}`),
    ];
    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="lumi-${profile.displayName}-mastery.csv"`,
      },
    });
  }

  return NextResponse.json(report);
}
