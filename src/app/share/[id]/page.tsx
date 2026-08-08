"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

export default function SharePage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<{
    child: {
      displayName: string;
      streakDays: number;
      stars: number;
      totalMinutes: number;
      interestPack: string;
    };
    progress: { reading: number; writing: number; math: number };
    topSkills: { id: string; mean: number }[];
    recentSessions: { domain: string; itemsDone: number; adaptations: number; startedAt: string }[];
    note: string;
  } | null>(null);

  useEffect(() => {
    void fetch(`/api/share/${params.id}`)
      .then((r) => r.json())
      .then(setData);
  }, [params.id]);

  if (!data) return <main className="p-6">Loading shared progress...</main>;

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <p className="lumi-chip">Read-only educator / specialist share</p>
      <h1 className="text-3xl font-bold">{data.child.displayName}&apos;s Lumi progress</h1>
      <p className="text-[color:var(--muted)]">{data.note}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="m-0 text-sm">Streak</p>
          <p className="m-0 text-2xl font-bold">{data.child.streakDays} days</p>
        </Card>
        <Card>
          <p className="m-0 text-sm">Stars</p>
          <p className="m-0 text-2xl font-bold">{data.child.stars}</p>
        </Card>
        <Card>
          <p className="m-0 text-sm">Minutes</p>
          <p className="m-0 text-2xl font-bold">{data.child.totalMinutes}</p>
        </Card>
      </div>
      <Card>
        <h2 className="mt-0 text-xl font-bold">Domain mastery</h2>
        {(["reading", "writing", "math"] as const).map((d) => (
          <p key={d} className="capitalize">
            {d}: <strong>{Math.round(data.progress[d] * 100)}%</strong>
          </p>
        ))}
        <p className="text-sm text-[color:var(--muted)]">Interest theme: {data.child.interestPack}</p>
      </Card>
      <Card>
        <h2 className="mt-0 text-xl font-bold">Strong skills</h2>
        <ul>
          {data.topSkills.map((s) => (
            <li key={s.id}>
              {s.id} · {Math.round(s.mean * 100)}%
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="mt-0 text-xl font-bold">Recent sessions</h2>
        {data.recentSessions.map((s, i) => (
          <p key={`${s.startedAt}-${i}`} className="capitalize">
            {s.domain} · {s.itemsDone} items · {s.adaptations} adaptations ·{" "}
            {new Date(s.startedAt).toLocaleString()}
          </p>
        ))}
      </Card>
      <Link className="lumi-btn lumi-btn-ghost inline-flex" href="/">
        About Lumi
      </Link>
    </main>
  );
}
