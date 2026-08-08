"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

type ProfileRow = {
  id: string;
  displayName: string;
  sensoryMode: string;
  interestPack: string;
  ageBand: string;
};

function AdultInner() {
  const params = useSearchParams();
  const initialId = params.get("childId") || "";
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [selected, setSelected] = useState(initialId);
  const [report, setReport] = useState<{
    profile: {
      displayName: string;
      sessions: { id: string; domain: string; itemsDone: number; adaptations: number; startedAt: string }[];
    };
    progress: { reading: number; writing: number; math: number; needsWork: { id: string; mean: number }[] };
  } | null>(null);

  useEffect(() => {
    void fetch("/api/profiles")
      .then((r) => r.json())
      .then((j) => {
        setProfiles(j.profiles);
        if (!selected && j.profiles[0]) setSelected(j.profiles[0].id);
      });
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    void fetch(`/api/profiles/${selected}`)
      .then((r) => r.json())
      .then(setReport);
  }, [selected]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-4 px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-3xl font-bold">Adult / Educator view</h1>
          <p className="m-0 text-[color:var(--muted)]">
            Practice mastery and adaptation traces. Not a clinical assessment.
          </p>
        </div>
        <Link className="lumi-btn lumi-btn-ghost" href="/app">
          Kid home
        </Link>
        <Link className="lumi-btn lumi-btn-secondary" href="/parents">
          Parent hub
        </Link>
      </header>

      <Card className="flex flex-wrap gap-2">
        {profiles.map((p) => (
          <button
            key={p.id}
            type="button"
            className="lumi-btn lumi-btn-secondary"
            style={{ background: selected === p.id ? "#d7efe7" : undefined }}
            onClick={() => setSelected(p.id)}
          >
            {p.displayName}
          </button>
        ))}
      </Card>

      {report && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {(
              [
                ["Reading", report.progress.reading],
                ["Writing", report.progress.writing],
                ["Math", report.progress.math],
              ] as const
            ).map(([label, value]) => (
              <Card key={label}>
                <h2 className="mt-0 text-lg font-bold">{label}</h2>
                <p className="m-0 text-3xl font-bold">{Math.round(value * 100)}%</p>
              </Card>
            ))}
          </div>

          <Card>
            <h2 className="mt-0 text-xl font-bold">Focus next</h2>
            <ul>
              {report.progress.needsWork.map((s) => (
                <li key={s.id}>
                  {s.id} · {Math.round(s.mean * 100)}%
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="mt-0 text-xl font-bold">Recent sessions</h2>
            <div className="space-y-2">
              {report.profile.sessions.map((s) => (
                <div key={s.id} className="rounded-2xl bg-[#eef5f1] p-3">
                  <strong className="capitalize">{s.domain}</strong> · {s.itemsDone} items ·{" "}
                  {s.adaptations} adaptations · {new Date(s.startedAt).toLocaleString()}
                </div>
              ))}
              {report.profile.sessions.length === 0 && <p>No sessions yet.</p>}
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <a className="lumi-btn lumi-btn-primary" href={`/api/export/${selected}`}>
              Export JSON
            </a>
            <a className="lumi-btn lumi-btn-secondary" href={`/api/export/${selected}?format=csv`}>
              Export CSV
            </a>
            <Link className="lumi-btn lumi-btn-ghost" href="/docs/pilot">
              Pilot protocol
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default function AdultPage() {
  return (
    <Suspense>
      <AdultInner />
    </Suspense>
  );
}
