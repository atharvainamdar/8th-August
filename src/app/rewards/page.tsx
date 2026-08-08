"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const REWARDS = [
  { id: "sticker-star", name: "Star sticker", cost: 5, emoji: "⭐" },
  { id: "sticker-train", name: "Train badge", cost: 10, emoji: "🚂" },
  { id: "sticker-rocket", name: "Rocket badge", cost: 10, emoji: "🚀" },
  { id: "sticker-dino", name: "Dino badge", cost: 10, emoji: "🦕" },
  { id: "break-pass", name: "Extra calm break", cost: 8, emoji: "🧘" },
  { id: "theme-unlock", name: "Mystery theme day", cost: 20, emoji: "🎁" },
];

function RewardsInner() {
  const params = useSearchParams();
  const childId = params.get("childId") || "";
  const [stars, setStars] = useState(0);
  const [name, setName] = useState("Friend");
  const [owned, setOwned] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!childId) return;
    void fetch(`/api/profiles/${childId}`)
      .then((r) => r.json())
      .then((j) => {
        setStars(j.profile.stars ?? 0);
        setName(j.profile.displayName);
      });
    const key = `lumi-rewards-${childId}`;
    try {
      setOwned(JSON.parse(localStorage.getItem(key) || "[]"));
    } catch {
      setOwned([]);
    }
  }, [childId]);

  const buy = async (id: string, cost: number) => {
    if (!childId) return;
    if (owned.includes(id)) {
      setMsg("You already have this.");
      return;
    }
    if (stars < cost) {
      setMsg("Keep practicing to earn more stars.");
      return;
    }
    const res = await fetch(`/api/profiles/${childId}/spend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cost, rewardId: id }),
    });
    if (!res.ok) {
      setMsg("Could not redeem right now.");
      return;
    }
    const json = await res.json();
    setStars(json.stars);
    const next = [...owned, id];
    setOwned(next);
    localStorage.setItem(`lumi-rewards-${childId}`, JSON.stringify(next));
    setMsg("Nice! Reward unlocked.");
  };

  if (!childId) {
    return (
      <main className="p-6">
        <p>Pick a learner from the student app first.</p>
        <Link href="/app">Go to app</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="m-0 text-3xl font-bold">Reward board</h1>
          <p className="m-0 text-[color:var(--muted)]">
            {name} · ⭐ {stars} stars
          </p>
        </div>
        <Link className="lumi-btn lumi-btn-ghost" href={`/app?focus=${childId}`}>
          Back
        </Link>
      </div>
      {msg && <Card>{msg}</Card>}
      <div className="grid gap-3 sm:grid-cols-2">
        {REWARDS.map((r) => (
          <Card key={r.id} className="space-y-2">
            <p className="m-0 text-3xl">{r.emoji}</p>
            <h2 className="m-0 text-lg font-bold">{r.name}</h2>
            <p className="m-0 text-[color:var(--muted)]">{r.cost} stars</p>
            <Button
              variant={owned.includes(r.id) ? "ghost" : "secondary"}
              disabled={owned.includes(r.id)}
              onClick={() => buy(r.id, r.cost)}
            >
              {owned.includes(r.id) ? "Owned" : "Redeem"}
            </Button>
          </Card>
        ))}
      </div>
    </main>
  );
}

export default function RewardsPage() {
  return (
    <Suspense>
      <RewardsInner />
    </Suspense>
  );
}
