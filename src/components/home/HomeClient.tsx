"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "../ui/Card";
import { TodayPlan } from "./TodayPlan";
import { interestLabel, SUBJECTS } from "@/lib/ui/labels";

type Profile = {
  id: string;
  displayName: string;
  ageBand: string;
  sensoryMode: string;
  interestPack: string;
  placed: boolean;
  streakDays?: number;
  stars?: number;
};

export function HomeClient({ profiles }: { profiles: Profile[] }) {
  const [selected, setSelected] = useState(profiles[0]?.id ?? "");
  const [mood, setMood] = useState<"great" | "ok" | "hard">("ok");
  const [showGrownups, setShowGrownups] = useState(false);
  const profile = profiles.find((p) => p.id === selected) ?? profiles[0];

  if (!profile) return null;

  const learnHref = `/learn?childId=${profile.id}&mood=${mood}`;
  const placeHref = `/place?childId=${profile.id}&mood=${mood}`;

  return (
    <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        <h2 className="m-0 text-xl font-bold">Who is practicing?</h2>
        {profiles.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id)}
            className="lumi-card w-full p-4 text-left"
            style={{
              borderColor: selected === p.id ? "var(--primary)" : "var(--border)",
              borderWidth: 2,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="m-0 text-2xl font-bold">{p.displayName}</h3>
                <p className="m-0 text-[color:var(--muted)]">
                  Likes {interestLabel(p.interestPack)}
                </p>
                <p className="m-0 mt-1 text-sm font-semibold">
                  🔥 {p.streakDays ?? 0} day streak · ⭐ {p.stars ?? 0} stars
                </p>
              </div>
              <span className="lumi-chip">{p.placed ? "Ready" : "First time"}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <TodayPlan childId={profile.id} />
        <Card className="space-y-4">
          <h3 className="m-0 text-xl font-bold">How do you feel?</h3>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["great", "😊 Great"],
                ["ok", "😐 OK"],
                ["hard", "😓 Hard"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className="lumi-btn lumi-btn-secondary"
                style={{
                  background: mood === value ? "#d7efe7" : undefined,
                  borderColor: mood === value ? "var(--primary)" : "transparent",
                }}
                onClick={() => setMood(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <Link
            className="lumi-btn lumi-btn-primary block py-4 text-center text-xl"
            href={profile.placed ? learnHref : placeHref}
          >
            {profile.placed ? "Start practice" : "Start first check-in"}
          </Link>

          <div>
            <p className="mb-2 mt-0 text-sm font-semibold text-[color:var(--muted)]">
              Or pick a subject
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SUBJECTS.map((subject) => (
                <Link
                  key={subject.id}
                  className="lumi-btn lumi-btn-secondary flex flex-col items-center gap-1 py-3 text-center"
                  href={`/learn?childId=${profile.id}&mood=${mood}&domain=${subject.id}`}
                >
                  <span className="text-2xl" aria-hidden>
                    {subject.emoji}
                  </span>
                  <span>{subject.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link
            className="lumi-btn lumi-btn-ghost block text-center"
            href={`/progress?childId=${profile.id}`}
          >
            My stars & growth
          </Link>

          <div>
            <button
              type="button"
              className="lumi-btn lumi-btn-ghost w-full text-sm"
              onClick={() => setShowGrownups((v) => !v)}
            >
              {showGrownups ? "Hide grown-up links" : "Grown-ups"}
            </button>
            {showGrownups && (
              <div className="mt-2 flex flex-col gap-2">
                <Link className="lumi-btn lumi-btn-ghost text-center" href="/parents">
                  Parent hub
                </Link>
                <Link
                  className="lumi-btn lumi-btn-ghost text-center"
                  href={`/rewards?childId=${profile.id}`}
                >
                  Reward board
                </Link>
                <Link
                  className="lumi-btn lumi-btn-ghost text-center"
                  href={`/settings/${profile.id}`}
                >
                  Settings
                </Link>
                <Link
                  className="lumi-btn lumi-btn-ghost text-center"
                  href={`/history/${profile.id}`}
                >
                  History
                </Link>
                <Link className="lumi-btn lumi-btn-ghost text-center" href="/setup">
                  New profile
                </Link>
                <Link className="lumi-btn lumi-btn-ghost text-center" href="/syllabus">
                  Full syllabus
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
