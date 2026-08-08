"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Profile = {
  id: string;
  displayName: string;
  interestPack: string;
  sensoryMode: string;
  streakDays?: number;
  stars?: number;
  totalMinutes?: number;
};

export default function ParentsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState("");
  const [report, setReport] = useState<{
    progress: { reading: number; writing: number; math: number };
    profile: {
      displayName: string;
      streakDays: number;
      stars: number;
      totalMinutes: number;
      sessions: { domain: string; itemsDone: number; adaptations: number; startedAt: string; starsEarned?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    void fetch("/api/profiles")
      .then((r) => r.json())
      .then((j) => {
        setProfiles(j.profiles);
        if (j.profiles[0]) setSelected(j.profiles[0].id);
      });
  }, []);

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
          <h1 className="m-0 text-3xl font-bold">Parent hub</h1>
          <p className="m-0 text-[color:var(--muted)]">
            See practice, streaks, and skill growth. Built for busy parents.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="lumi-btn lumi-btn-primary" href="/setup">
            Add child
          </Link>
          <Link className="lumi-btn lumi-btn-secondary" href="/app">
            Open student app
          </Link>
          <Link className="lumi-btn lumi-btn-ghost" href="/">
            Marketing site
          </Link>
        </div>
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
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <p className="m-0 text-sm text-[color:var(--muted)]">Streak</p>
              <p className="m-0 text-3xl font-bold">{report.profile.streakDays ?? 0} days</p>
            </Card>
            <Card>
              <p className="m-0 text-sm text-[color:var(--muted)]">Stars</p>
              <p className="m-0 text-3xl font-bold">{report.profile.stars ?? 0}</p>
            </Card>
            <Card>
              <p className="m-0 text-sm text-[color:var(--muted)]">Practice minutes</p>
              <p className="m-0 text-3xl font-bold">{report.profile.totalMinutes ?? 0}</p>
            </Card>
            <Card>
              <p className="m-0 text-sm text-[color:var(--muted)]">Sessions</p>
              <p className="m-0 text-3xl font-bold">{report.profile.sessions.length}</p>
            </Card>
          </div>

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
            <h2 className="mt-0 text-xl font-bold">Recent practice</h2>
            <div className="space-y-2">
              {report.profile.sessions.map((s, idx) => (
                <div key={`${s.startedAt}-${idx}`} className="rounded-2xl bg-[#eef5f1] p-3">
                  <strong className="capitalize">{s.domain}</strong> · {s.itemsDone} items ·{" "}
                  {s.adaptations} adaptations · {new Date(s.startedAt).toLocaleString()}
                </div>
              ))}
              {report.profile.sessions.length === 0 && <p>No sessions yet. Start from the student app.</p>}
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <a className="lumi-btn lumi-btn-primary" href={`/api/export/${selected}`}>
              Download progress JSON
            </a>
            <a className="lumi-btn lumi-btn-secondary" href={`/api/export/${selected}?format=csv`}>
              Download CSV
            </a>
            <a className="lumi-btn lumi-btn-ghost" href={`/api/report/weekly/${selected}`}>
              Weekly report
            </a>
            <Link className="lumi-btn lumi-btn-ghost" href={`/progress?childId=${selected}`}>
              Kid Growth Story
            </Link>
            <Link className="lumi-btn lumi-btn-ghost" href={`/rewards?childId=${selected}`}>
              Rewards
            </Link>
            <Button
              variant="ghost"
              onClick={async () => {
                if (!confirm("Delete this child profile and practice data?")) return;
                await fetch(`/api/profiles/${selected}`, { method: "DELETE" });
                const j = await fetch("/api/profiles").then((r) => r.json());
                setProfiles(j.profiles);
                setSelected(j.profiles[0]?.id || "");
                setReport(null);
              }}
            >
              Delete profile
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
