"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type LessonMeta = {
  id: string;
  title: string;
  skills: string[];
  modalities: string[];
  minutes: number;
  unitTitle?: string;
  domain?: string;
};

function LessonInner() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const childId = search.get("childId") || "";
  const [lesson, setLesson] = useState<LessonMeta | null>(null);
  const [profiles, setProfiles] = useState<{ id: string; displayName: string }[]>([]);

  useEffect(() => {
    void fetch("/api/syllabus")
      .then((r) => r.json())
      .then((j) => {
        const found = (j.lessons as LessonMeta[]).find((l) => l.id === params.id);
        setLesson(found || null);
      });
    void fetch("/api/profiles")
      .then((r) => r.json())
      .then((j) => setProfiles(j.profiles || []));
  }, [params.id]);

  if (!lesson) {
    return (
      <main className="p-6">
        <p>Loading lesson...</p>
      </main>
    );
  }

  const domain =
    lesson.domain === "writing" || lesson.domain === "math" || lesson.domain === "reading"
      ? lesson.domain
      : "mixed";

  const start = (id: string) => {
    const q = new URLSearchParams({
      childId: id,
      mood: "ok",
      lessonId: lesson.id,
    });
    if (domain !== "mixed") q.set("domain", domain);
    router.push(`/learn?${q.toString()}`);
  };

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-4 px-4 py-6">
      <Link className="lumi-btn lumi-btn-ghost inline-flex" href="/syllabus">
        Back to syllabus
      </Link>
      <Card className="space-y-3">
        <p className="m-0 text-sm font-semibold uppercase text-[color:var(--muted)]">
          {lesson.unitTitle || "Lesson"} · {lesson.minutes} min
        </p>
        <h1 className="m-0 text-3xl font-bold">{lesson.title}</h1>
        <p className="m-0 text-[color:var(--muted)]">
          Skills: {lesson.skills.join(", ") || "mixed practice"}
        </p>
        <p className="m-0 text-[color:var(--muted)]">
          Modes: {lesson.modalities.join(", ")}
        </p>
      </Card>

      <Card className="space-y-3">
        <h2 className="mt-0 text-xl font-bold">Who is practicing?</h2>
        {childId ? (
          <Button onClick={() => start(childId)}>Start this lesson</Button>
        ) : (
          <div className="flex flex-col gap-2">
            {profiles.map((p) => (
              <Button key={p.id} variant="secondary" onClick={() => start(p.id)}>
                Start with {p.displayName}
              </Button>
            ))}
            {profiles.length === 0 && (
              <Link className="lumi-btn lumi-btn-primary inline-flex" href="/setup">
                Create a profile first
              </Link>
            )}
          </div>
        )}
      </Card>
    </main>
  );
}

export default function LessonPage() {
  return (
    <Suspense>
      <LessonInner />
    </Suspense>
  );
}
