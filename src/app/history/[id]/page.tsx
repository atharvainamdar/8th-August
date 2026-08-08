"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

type SessionRow = {
  id: string;
  domain: string;
  itemsDone: number;
  adaptations: number;
  starsEarned?: number;
  startedAt: string;
  endedAt?: string | null;
};

export default function HistoryPage() {
  const params = useParams<{ id: string }>();
  const [name, setName] = useState("Learner");
  const [sessions, setSessions] = useState<SessionRow[]>([]);

  useEffect(() => {
    void fetch(`/api/profiles/${params.id}`)
      .then((r) => r.json())
      .then((j) => {
        setName(j.profile.displayName);
        setSessions(j.profile.sessions || []);
      });
  }, [params.id]);

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap gap-2">
        <Link className="lumi-btn lumi-btn-ghost" href={`/app?focus=${params.id}`}>
          Back
        </Link>
        <Link className="lumi-btn lumi-btn-ghost" href={`/parents`}>
          Parent hub
        </Link>
      </div>
      <h1 className="text-3xl font-bold">Practice history</h1>
      <p className="text-[color:var(--muted)]">{name}</p>
      {sessions.length === 0 && <Card>No sessions yet.</Card>}
      {sessions.map((s) => (
        <Card key={s.id}>
          <p className="m-0 font-bold capitalize">{s.domain}</p>
          <p className="m-0 text-sm text-[color:var(--muted)]">
            {new Date(s.startedAt).toLocaleString()} · {s.itemsDone} items · {s.adaptations}{" "}
            adaptations · ⭐ {s.starsEarned ?? 0}
          </p>
        </Card>
      ))}
    </main>
  );
}
