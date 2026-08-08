"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "../ui/Card";

export function TodayPlan({ childId }: { childId: string }) {
  const [data, setData] = useState<{
    recommendation: string;
    nextLesson?: { id: string; title: string; minutes: number };
    week?: { title: string; goals: string[] };
    weakSkills?: { id: string; mean: number }[];
  } | null>(null);

  useEffect(() => {
    if (!childId) return;
    void fetch(`/api/today?childId=${childId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [childId]);

  if (!childId || !data) return null;

  return (
    <Card className="space-y-3">
      <h3 className="m-0 text-xl font-bold">Today&apos;s plan</h3>
      <p className="m-0 text-[color:var(--muted)]">{data.recommendation}</p>
      {data.week && (
        <p className="m-0 text-sm">
          <strong>{data.week.title}</strong> · {data.week.goals.join(" · ")}
        </p>
      )}
      {data.nextLesson && (
        <Link
          className="lumi-btn lumi-btn-primary inline-flex"
          href={`/lessons/${data.nextLesson.id}?childId=${childId}`}
        >
          Start: {data.nextLesson.title}
        </Link>
      )}
      {data.weakSkills && data.weakSkills.length > 0 && (
        <p className="m-0 text-sm text-[color:var(--muted)]">
          Focus skills: {data.weakSkills.map((s) => s.id.split(".").slice(-1)[0]).join(", ")}
        </p>
      )}
    </Card>
  );
}
