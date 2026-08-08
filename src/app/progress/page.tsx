"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { LumiCompanion } from "@/components/companion/Lumi";

function ProgressInner() {
  const params = useSearchParams();
  const childId = params.get("childId") || "";
  const done = params.get("done");
  const [data, setData] = useState<{
    profile: { displayName: string; interestPack: string };
    progress: {
      reading: number;
      writing: number;
      math: number;
      topGrowth: { id: string; mean: number }[];
      needsWork: { id: string; mean: number }[];
    };
  } | null>(null);

  useEffect(() => {
    if (!childId) return;
    void fetch(`/api/profiles/${childId}`)
      .then((r) => r.json())
      .then(setData);
  }, [childId]);

  if (!childId) return <main className="p-6">Missing profile.</main>;
  if (!data) return <main className="p-6">Loading growth story...</main>;

  const bars = [
    ["Reading", data.progress.reading],
    ["Writing", data.progress.writing],
    ["Math", data.progress.math],
  ] as const;

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <LumiCompanion
        mood="celebrate"
        message={
          done
            ? `Great practice, ${data.profile.displayName}. Your Growth Story updated.`
            : `Here is your Growth Story, ${data.profile.displayName}.`
        }
      />
      <Card>
        <h1 className="mt-0 text-3xl font-bold">Growth Story</h1>
        <p className="text-[color:var(--muted)]">
          Practice makes skills stronger. This is not a grade. It is a map of what you are building.
        </p>
        <div className="mt-4 space-y-3">
          {bars.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between font-semibold">
                <span>{label}</span>
                <span>{Math.round(value * 100)}%</span>
              </div>
              <div className="h-4 rounded-full bg-[#e4ece8]">
                <div
                  className="h-4 rounded-full bg-[color:var(--primary)]"
                  style={{ width: `${Math.round(value * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mt-0 text-xl font-bold">Strong now</h2>
          <ul>
            {data.progress.topGrowth.map((s) => (
              <li key={s.id}>
                {s.id} · {Math.round(s.mean * 100)}%
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="mt-0 text-xl font-bold">Next practice</h2>
          <ul>
            {data.progress.needsWork.map((s) => (
              <li key={s.id}>
                {s.id} · {Math.round(s.mean * 100)}%
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link className="lumi-btn lumi-btn-primary" href={`/?focus=${childId}`}>
          Home
        </Link>
        <Link className="lumi-btn lumi-btn-secondary" href={`/learn?childId=${childId}`}>
          Practice more
        </Link>
        <Link className="lumi-btn lumi-btn-ghost" href={`/adult?childId=${childId}`}>
          Adult report
        </Link>
      </div>
    </main>
  );
}

export default function ProgressPage() {
  return (
    <Suspense>
      <ProgressInner />
    </Suspense>
  );
}
