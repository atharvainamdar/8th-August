import { NextResponse } from "next/server";
import { getProfile, progressSummary } from "@/lib/db/profile";
import { masteryMean } from "@/lib/adaptive/mastery";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const progress = await progressSummary(id);
  const weekSessions = profile.sessions.filter((s) => {
    const age = Date.now() - new Date(s.startedAt).getTime();
    return age < 7 * 24 * 60 * 60 * 1000;
  });
  const adaptations = weekSessions.reduce((n, s) => n + s.adaptations, 0);
  const items = weekSessions.reduce((n, s) => n + s.itemsDone, 0);
  const top = profile.mastery
    .map((m) => ({ id: m.skillId, mean: masteryMean(m) }))
    .sort((a, b) => b.mean - a.mean)
    .slice(0, 5);

  const html = `<!doctype html>
<html><head><meta charset="utf-8"/><title>Lumi Weekly Report — ${profile.displayName}</title>
<style>
body{font-family:Segoe UI,sans-serif;max-width:720px;margin:40px auto;color:#1f2a24;line-height:1.5}
.card{border:1px solid #d7e2dc;border-radius:16px;padding:16px;margin:12px 0}
.bar{height:10px;background:#e4ece8;border-radius:999px;overflow:hidden}
.fill{height:10px;background:#3d8f7a}
h1,h2{margin:0 0 8px}
</style></head><body>
<h1>Lumi Weekly Report</h1>
<p>Child: <strong>${profile.displayName}</strong> · Generated ${new Date().toLocaleString()}</p>
<p>Educational practice summary. Not a clinical assessment.</p>
<div class="card">
  <h2>This week</h2>
  <p>Sessions: ${weekSessions.length} · Items practiced: ${items} · Adaptations: ${adaptations}</p>
  <p>Streak: ${profile.streakDays} days · Stars: ${profile.stars} · Total minutes: ${profile.totalMinutes}</p>
</div>
<div class="card">
  <h2>Mastery snapshot</h2>
  ${(["reading","writing","math"] as const).map((d) => {
    const pct = Math.round(progress[d] * 100);
    return `<p><strong>${d}</strong> ${pct}%</p><div class="bar"><div class="fill" style="width:${pct}%"></div></div>`;
  }).join("")}
</div>
<div class="card">
  <h2>Strong skills</h2>
  <ul>${top.map((t) => `<li>${t.id} · ${Math.round(t.mean * 100)}%</li>`).join("")}</ul>
</div>
<p>Keep going with 12–15 minutes, 4–5 days this week.</p>
</body></html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="lumi-weekly-${profile.displayName}.html"`,
    },
  });
}
