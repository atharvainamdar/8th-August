import Link from "next/link";
import { getSyllabus } from "@/lib/curriculum/syllabus";
import { Card } from "@/components/ui/Card";

export default function SyllabusPage() {
  const syllabus = getSyllabus();

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-4 px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-3xl font-bold">{syllabus.name}</h1>
          <p className="m-0 text-[color:var(--muted)]">
            {syllabus.audience} · {syllabus.cadence}
          </p>
        </div>
        <div className="flex gap-2">
          <Link className="lumi-btn lumi-btn-primary" href="/setup">
            Start with this syllabus
          </Link>
          <Link className="lumi-btn lumi-btn-ghost" href="/app">
            Student app
          </Link>
        </div>
      </header>

      <Card>
        <h2 className="mt-0 text-xl font-bold">8-week plan</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {syllabus.weeks.map((w) => (
            <div key={w.id} className="rounded-2xl bg-[#eef5f1] p-4">
              <p className="m-0 font-bold">
                {w.id.replace("week-", "Week ")} · {w.title}
              </p>
              <p className="m-0 mt-1 text-sm text-[color:var(--muted)]">
                Goals: {w.goals.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {syllabus.units.map((unit) => (
        <Card key={unit.id}>
          <h2 className="mt-0 text-xl font-bold">
            {unit.title}{" "}
            <span className="text-base font-semibold capitalize text-[color:var(--muted)]">
              ({unit.domain})
            </span>
          </h2>
          <div className="space-y-2">
            {unit.lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-2xl border border-[color:var(--border)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="m-0 font-semibold">{lesson.title}</p>
                    <p className="m-0 text-sm text-[color:var(--muted)]">
                      {lesson.minutes} min · skills: {lesson.skills.join(", ") || "mixed"} · modes:{" "}
                      {lesson.modalities.join(", ")}
                    </p>
                  </div>
                  <Link className="lumi-btn lumi-btn-secondary" href={`/lessons/${lesson.id}`}>
                    Open lesson
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </main>
  );
}
