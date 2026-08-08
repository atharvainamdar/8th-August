"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ActivityRenderer } from "@/components/activities/ActivityRenderer";
import { CalmCorner } from "@/components/calm/CalmCorner";
import { LumiCompanion } from "@/components/companion/Lumi";
import { VisualSchedule } from "@/components/session/VisualSchedule";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { SessionRuntime } from "@/lib/adaptive/session";
import type { ActivityResult } from "@/lib/adaptive/types";
import { modalityLabel } from "@/lib/curriculum/activities";

function LearnInner() {
  const params = useSearchParams();
  const router = useRouter();
  const childId = params.get("childId") || "";
  const mood = params.get("mood") || "ok";
  const domain = params.get("domain") || undefined;
  const placement = params.get("placement") === "1";
  const lessonId = params.get("lessonId") || undefined;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<SessionRuntime | null>(null);
  const [coachMessage, setCoachMessage] = useState("Loading your plan...");
  const [showCalm, setShowCalm] = useState(false);
  const [transition, setTransition] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [homeworkNote, setHomeworkNote] = useState<string | null>(null);
  const [starsEarned, setStarsEarned] = useState(0);

  useEffect(() => {
    if (!childId) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, mood, domain, placement, lessonId }),
      });
      const json = await res.json();
      if (cancelled) return;
      setSessionId(json.sessionId);
      setRuntime(json.runtime);
      setCoachMessage(
        lessonId
          ? `Hi ${json.runtime.state.displayName}. Today we will do your lesson with your ${json.runtime.state.interestPack} theme.`
          : `Hi ${json.runtime.state.displayName}. We will practice with your ${json.runtime.state.interestPack} theme.`
      );
      document.documentElement.dataset.sensory = json.runtime.state.sensoryMode;
      document.documentElement.dataset.font = json.runtime.state.dyslexiaFont
        ? "dyslexia"
        : "default";
    })();
    return () => {
      cancelled = true;
    };
  }, [childId, mood, domain, placement, lessonId]);

  const schedule = useMemo(() => {
    if (!runtime) return [];
    const labels = Array.from({ length: runtime.itemsPlanned }).map((_, i) => {
      if (i < runtime.itemsDone) return "Done";
      if (i === runtime.itemsDone) return runtime.item.activityKind.replaceAll("_", " ");
      return "Practice";
    });
    return labels.slice(0, Math.min(5, labels.length));
  }, [runtime]);

  const onResult = async (result: ActivityResult) => {
    if (!runtime || !sessionId || busy) return;
    setBusy(true);
    setFeedback(result.correct ? "Yes. That works." : "Good try. We can use more help.");
    const res = await fetch("/api/session/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, runtime, result }),
    });
    const json = await res.json();
    const next = json.runtime as SessionRuntime;
    setCoachMessage(json.coachMessage);
    if (json.starsEarned) setStarsEarned((s) => s + Number(json.starsEarned || 0));
    if (next.decision.offerCalmCorner || next.decision.action === "offer_break") {
      setTransition("Next: a short calm break is available.");
      setShowCalm(true);
      // Mark break acceptance in local event stream so policy won't loop
      next.events = [
        ...next.events,
        { type: "break_accepted", at: Date.now() },
      ];
    } else if (
      next.decision.action === "switch_modality" ||
      next.decision.action === "increase_scaffold"
    ) {
      setTransition(
        `Next: ${modalityLabel(next.decision.modality)} · more support (${next.decision.scaffold})`
      );
    } else if (next.decision.action === "change_skill") {
      setTransition("Next: a new skill.");
    } else {
      setTransition(null);
    }

    if (next.decision.action === "end_session") {
      setRuntime(next);
      setBusy(false);
      router.push(
        starsEarned + Number(json.starsEarned || 0) >= 4
          ? `/certificate/${childId}`
          : `/progress?childId=${childId}&done=1`
      );
      return;
    }

    setTimeout(() => {
      setRuntime(next);
      setFeedback(null);
      setBusy(false);
    }, next.state.sensoryMode === "calm" ? 400 : 700);
  };

  const onHomework = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/vision", { method: "POST", body });
    const json = await res.json();
    setHomeworkNote(json.guidance);
    setCoachMessage(json.guidance);
  };

  if (!childId) {
    return (
      <main className="p-6">
        <p>Missing child profile.</p>
        <Link href="/">Go home</Link>
      </main>
    );
  }

  if (showCalm) {
    return (
      <main data-sensory={runtime?.state.sensoryMode}>
        <CalmCorner
          onDone={() => {
            setShowCalm(false);
            setTransition("Back to practice.");
          }}
        />
      </main>
    );
  }

  if (!runtime) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <p className="text-xl font-semibold">Lumi is getting your plan ready...</p>
      </main>
    );
  }

  return (
    <main
      className="mx-auto min-h-screen max-w-5xl space-y-4 px-4 py-4 md:px-6"
      data-sensory={runtime.state.sensoryMode}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <LumiCompanion
          mood={
            runtime.decision.action === "offer_break"
              ? "calm"
              : feedback?.startsWith("Yes")
                ? "celebrate"
                : "talk"
          }
          message={coachMessage}
          motionEnabled={runtime.state.motionEnabled}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setShowCalm(true)}>
            Calm Corner
          </Button>
          <Link className="lumi-btn lumi-btn-ghost" href="/">
            Stop
          </Link>
        </div>
      </header>

      <VisualSchedule items={schedule} currentIndex={Math.min(runtime.itemsDone, schedule.length - 1)} />

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-sm font-semibold uppercase text-[color:var(--muted)]">First → Then</p>
          <p className="m-0 text-lg font-bold">
            First: practice · Then: stars & break
          </p>
        </div>
        <p className="m-0 text-lg font-bold">⭐ Session stars: {starsEarned}</p>
      </Card>

      {transition && (
        <Card className="border-[color:var(--accent)] bg-[#eef2ff]">
          <p className="m-0 font-semibold">{transition}</p>
          <p className="m-0 mt-1 text-sm text-[color:var(--muted)]">
            Adaptation #{runtime.adaptations} · Regulation: {runtime.state.regulation}
          </p>
        </Card>
      )}

      {feedback && (
        <Card>
          <p className="m-0 text-lg font-semibold">{feedback}</p>
        </Card>
      )}

      <ActivityRenderer
        item={runtime.item}
        onResult={onResult}
        soundEnabled={runtime.state.soundEnabled}
      />

      <Card className="space-y-3">
        <h3 className="m-0 text-lg font-bold">Homework photo help</h3>
        <p className="m-0 text-[color:var(--muted)]">
          Optional. Lumi gives one small step, not a full answer dump.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onHomework(file);
          }}
        />
        {homeworkNote && <p className="m-0 rounded-2xl bg-[#eef5f1] p-3">{homeworkNote}</p>}
      </Card>
    </main>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<main className="p-6">Loading...</main>}>
      <LearnInner />
    </Suspense>
  );
}
