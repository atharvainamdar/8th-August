"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ActivityRenderer } from "@/components/activities/ActivityRenderer";
import { CalmCorner } from "@/components/calm/CalmCorner";
import { LumiCompanion } from "@/components/companion/Lumi";
import { VisualSchedule } from "@/components/session/VisualSchedule";
import { SessionTimer } from "@/components/session/SessionTimer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { SessionRuntime } from "@/lib/adaptive/session";
import type { ActivityResult } from "@/lib/adaptive/types";
import { interestLabel } from "@/lib/ui/labels";

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
  const [coachMessage, setCoachMessage] = useState("Getting ready...");
  const [showCalm, setShowCalm] = useState(false);
  const [showHomework, setShowHomework] = useState(false);
  const [showDone, setShowDone] = useState(false);
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
      const theme = interestLabel(json.runtime.state.interestPack);
      setCoachMessage(
        lessonId
          ? `Hi ${json.runtime.state.displayName}. Today we practice with your ${theme} theme.`
          : `Hi ${json.runtime.state.displayName}. Let's practice with your ${theme} theme.`
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
      if (i === runtime.itemsDone) return "Now";
      return "Next";
    });
    return labels.slice(0, Math.min(5, labels.length));
  }, [runtime]);

  const finishSession = (totalStars: number) => {
    setShowDone(true);
    setTimeout(() => {
      router.push(
        totalStars >= 4
          ? `/certificate/${childId}`
          : `/progress?childId=${childId}&done=1`
      );
    }, 1600);
  };

  const onResult = async (result: ActivityResult) => {
    if (!runtime || !sessionId || busy) return;
    setBusy(true);
    setFeedback(result.correct ? "Yes! That works." : "Good try. Lumi will help.");
    const res = await fetch("/api/session/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, runtime, result }),
    });
    const json = await res.json();
    const next = json.runtime as SessionRuntime;
    setCoachMessage(json.coachMessage);
    const newStars = starsEarned + Number(json.starsEarned || 0);
    if (json.starsEarned) setStarsEarned(newStars);

    if (next.decision.offerCalmCorner || next.decision.action === "offer_break") {
      setTransition("Nice pause time. Calm Corner is ready.");
      setShowCalm(true);
      next.events = [...next.events, { type: "break_accepted", at: Date.now() }];
    } else if (
      next.decision.action === "switch_modality" ||
      next.decision.action === "increase_scaffold"
    ) {
      setTransition("Lumi will help a different way.");
    } else if (next.decision.action === "change_skill") {
      setTransition("Let's try a new one.");
    } else {
      setTransition(null);
    }

    if (next.decision.action === "end_session") {
      setRuntime(next);
      setBusy(false);
      finishSession(newStars);
      return;
    }

    setTimeout(() => {
      setRuntime(next);
      setFeedback(null);
      setBusy(false);
    }, next.state.sensoryMode === "calm" ? 400 : 700);
  };

  const askEasier = async () => {
    if (!runtime || busy) return;
    setTransition("Okay — Lumi will make this easier.");
    setCoachMessage("No problem. We can do an easier step together.");
    await onResult({
      skillId: runtime.item.skillId,
      activityKind: runtime.item.activityKind,
      correct: false,
      partial: 0.2,
      latencyMs: 45_000,
      modality: runtime.item.modality,
      scaffold: runtime.item.scaffold,
      hintsUsed: 2,
      skipped: true,
      response: "too_hard",
    });
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
        <Link href="/app">Go to student home</Link>
      </main>
    );
  }

  if (showDone) {
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <div className="space-y-3">
          <p className="m-0 text-5xl" aria-hidden>
            ⭐
          </p>
          <h1 className="m-0 text-3xl font-bold">Nice work!</h1>
          <p className="m-0 text-xl">You earned {starsEarned} stars this time.</p>
        </div>
      </main>
    );
  }

  if (showCalm) {
    return (
      <main data-sensory={runtime?.state.sensoryMode}>
        <CalmCorner
          onDone={() => {
            setShowCalm(false);
            setTransition("Welcome back. Ready when you are.");
          }}
        />
      </main>
    );
  }

  if (!runtime) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <p className="text-xl font-semibold">Lumi is getting ready...</p>
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
          <Button
            variant="ghost"
            onClick={() => finishSession(starsEarned)}
          >
            I&apos;m done
          </Button>
        </div>
      </header>

      <VisualSchedule
        items={schedule}
        currentIndex={Math.min(runtime.itemsDone, schedule.length - 1)}
      />

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-sm font-semibold uppercase text-[color:var(--muted)]">
            First → Then
          </p>
          <p className="m-0 text-lg font-bold">First: practice · Then: stars</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SessionTimer
            minutes={runtime.state.sessionMinutes}
            running={!showCalm && !busy}
          />
          <p className="m-0 text-lg font-bold">⭐ {starsEarned}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button variant="secondary" onClick={() => setShowCalm(true)} disabled={busy}>
          Need a break
        </Button>
        <Button variant="secondary" onClick={() => void askEasier()} disabled={busy}>
          Too hard
        </Button>
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() =>
            void onResult({
              skillId: runtime.item.skillId,
              activityKind: runtime.item.activityKind,
              correct: false,
              partial: 0,
              latencyMs: 1_000,
              modality: runtime.item.modality,
              scaffold: runtime.item.scaffold,
              hintsUsed: 0,
              skipped: true,
              response: "skip",
            })
          }
        >
          Skip
        </Button>
        <Button variant="ghost" onClick={() => finishSession(starsEarned)} disabled={busy}>
          I&apos;m done
        </Button>
      </div>

      {transition && (
        <Card className="border-[color:var(--accent)] bg-[#eef2ff]">
          <p className="m-0 font-semibold">{transition}</p>
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
        <button
          type="button"
          className="m-0 w-full text-left text-lg font-bold"
          onClick={() => setShowHomework((v) => !v)}
        >
          {showHomework ? "▾" : "▸"} Need help with a worksheet?
        </button>
        {showHomework && (
          <>
            <p className="m-0 text-[color:var(--muted)]">
              Optional. Take a photo and Lumi gives one small next step.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onHomework(file);
              }}
            />
            {homeworkNote && (
              <p className="m-0 rounded-2xl bg-[#eef5f1] p-3">{homeworkNote}</p>
            )}
          </>
        )}
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
