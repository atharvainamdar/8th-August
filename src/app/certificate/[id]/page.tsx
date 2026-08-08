"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

export default function CertificatePage() {
  const params = useParams<{ id: string }>();
  const [name, setName] = useState("Learner");
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    void fetch(`/api/profiles/${params.id}`)
      .then((r) => r.json())
      .then((j) => {
        setName(j.profile.displayName);
        setStars(j.profile.stars ?? 0);
        setStreak(j.profile.streakDays ?? 0);
      });
  }, [params.id]);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <Card className="space-y-4 border-4 border-[color:var(--primary)] text-center">
        <p className="m-0 text-sm font-semibold uppercase tracking-wide text-[color:var(--muted)]">
          Lumi Practice Certificate
        </p>
        <h1 className="m-0 text-4xl font-bold">Great work, {name}!</h1>
        <p className="m-0 text-lg">
          You practiced reading, writing, and arithmetic with a calm AI tutor.
        </p>
        <p className="m-0 text-xl font-semibold">
          ⭐ {stars} stars · 🔥 {streak}-day streak
        </p>
        <p className="m-0 text-sm text-[color:var(--muted)]">
          Keep practicing 12–15 minutes a day. Skills grow with use.
        </p>
        <div className="flex justify-center gap-2">
          <Link className="lumi-btn lumi-btn-primary" href={`/app?focus=${params.id}`}>
            Practice more
          </Link>
          <Link className="lumi-btn lumi-btn-ghost" href={`/parents`}>
            Parent hub
          </Link>
        </div>
      </Card>
    </main>
  );
}
