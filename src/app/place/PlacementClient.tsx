"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ActivityRenderer } from "@/components/activities/ActivityRenderer";
import { LumiCompanion } from "@/components/companion/Lumi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { SessionRuntime } from "@/lib/adaptive/session";
import type { ActivityResult } from "@/lib/adaptive/types";

function PlacementInner() {
  const params = useSearchParams();
  const router = useRouter();
  const childId = params.get("childId") || "";
  const mood = params.get("mood") || "ok";
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<SessionRuntime | null>(null);
  const [step, setStep] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [coach, setCoach] = useState("Placement helps Lumi find a good starting level.");

  useEffect(() => {
    if (!childId) return;
    void fetch("/api/session/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, mood, placement: true }),
    })
      .then((r) => r.json())
      .then((j) => {
        setSessionId(j.sessionId);
        setRuntime(j.runtime);
        document.documentElement.dataset.sensory = j.runtime.state.sensoryMode;
      });
    void fetch(`/api/profiles/${childId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placed: true }),
    });
  }, [childId, mood]);

  const total = useMemo(() => runtime?.itemsPlanned ?? 6, [runtime]);

  const onResult = async (result: ActivityResult) => {
    if (!runtime || !sessionId) return;
    const res = await fetch("/api/session/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, runtime, result }),
    });
    const json = await res.json();
    setCoach(json.coachMessage);
    setDoneCount((n) => n + 1);
    setStep((s) => s + 1);
    if (json.runtime.decision.action === "end_session" || doneCount + 1 >= total) {
      router.push(`/app?focus=${childId}&placed=1`);
      return;
    }
    setRuntime(json.runtime);
  };

  if (!childId) {
    return (
      <main className="p-6">
        Missing child profile.
      </main>
    );
  }

  if (!runtime) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <p className="text-xl font-semibold">Getting placement ready...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <LumiCompanion mood="talk" message={coach} motionEnabled={runtime.state.motionEnabled} />
      <Card>
        <h1 className="mt-0 text-2xl font-bold">Placement check</h1>
        <p className="text-[color:var(--muted)]">
          Short questions across reading, writing, and math. No grades — just a starting map.
        </p>
        <p className="font-semibold">
          Question {Math.min(step + 1, total)} of {total}
        </p>
        <div className="mt-2 h-3 rounded-full bg-[#e4ece8]">
          <div
            className="h-3 rounded-full bg-[color:var(--primary)]"
            style={{ width: `${Math.round((Math.min(step, total) / total) * 100)}%` }}
          />
        </div>
      </Card>
      <ActivityRenderer
        item={runtime.item}
        onResult={onResult}
        soundEnabled={runtime.state.soundEnabled}
      />
      <Button variant="ghost" onClick={() => router.push(`/app?focus=${childId}`)}>
        Skip for now
      </Button>
    </main>
  );
}

export default function PlacementClient() {
  return (
    <Suspense>
      <PlacementInner />
    </Suspense>
  );
}
