import Link from "next/link";
import { Card } from "@/components/ui/Card";

const FAQS = [
  {
    q: "Is Lumi therapy?",
    a: "No. Lumi is an academic practice tutor for reading, writing, and arithmetic. It is not clinical therapy.",
  },
  {
    q: "How much time does my child need?",
    a: "Most families use 12–15 minutes, 4–5 days a week. Short sessions finish cleanly.",
  },
  {
    q: "What if my child gets frustrated?",
    a: "Lumi watches struggle signals, increases support, can switch to voice/visual modes, and offers Calm Corner.",
  },
  {
    q: "Can we use special interests?",
    a: "Yes. Choose trains, space, dinosaurs, animals, or ocean. Problems and stories use that theme.",
  },
  {
    q: "How do parents see progress?",
    a: "Open Parent hub for streaks, mastery, weekly HTML reports, and CSV/JSON exports.",
  },
  {
    q: "Does it work without Wi‑Fi AI keys?",
    a: "Yes. The adaptive curriculum and browser voice work offline-first. Optional AI keys enrich coaching and homework photos.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap gap-2">
        <Link className="lumi-btn lumi-btn-ghost" href="/">
          Back
        </Link>
        <Link className="lumi-btn lumi-btn-primary" href="/setup">
          Start free
        </Link>
      </div>
      <h1 className="text-3xl font-bold">FAQ for parents</h1>
      {FAQS.map((f) => (
        <Card key={f.q}>
          <h2 className="mt-0 text-xl font-bold">{f.q}</h2>
          <p className="m-0 text-[color:var(--muted)]">{f.a}</p>
        </Card>
      ))}
    </main>
  );
}
