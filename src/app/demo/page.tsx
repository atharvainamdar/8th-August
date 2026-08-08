import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { listProfiles } from "@/lib/db/profile";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  const profiles = await listProfiles();
  const ava = profiles.find((p) => p.displayName === "Ava") ?? profiles[0];

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <h1 className="text-3xl font-bold">YC Demo Script — Lumi</h1>
      <Card className="space-y-3">
        <h2 className="mt-0 text-xl font-bold">1. Problem</h2>
        <p>
          Autistic kids often need more patient, high-quality practice. Parents are exhausted.
          Generic AI tutors overload senses or ignore uneven skills.
        </p>
        <h2 className="text-xl font-bold">2. Wedge</h2>
        <p>
          Lumi is a neurodivergent-first Primer: reading, writing, and arithmetic with real multimodal
          adaptation (difficulty, scaffold, modality, sensory, interest, pacing).
        </p>
        <h2 className="text-xl font-bold">3. Live path</h2>
        <ol>
          <li>Open Ava (calm + trains) from Home.</li>
          <li>Choose mood &quot;Hard&quot;.</li>
          <li>Start Reading. Answer incorrectly twice.</li>
          <li>Watch scaffold increase + modality switch + Calm Corner offer.</li>
          <li>Open Growth Story and Adult export.</li>
        </ol>
        {ava ? (
          <Link
            className="lumi-btn lumi-btn-primary inline-flex"
            href={`/?focus=${ava.id}`}
          >
            Start with {ava.displayName}
          </Link>
        ) : (
          <Link className="lumi-btn lumi-btn-primary inline-flex" href="/setup">
            Create a profile first
          </Link>
        )}
      </Card>
      <Card>
        <h2 className="mt-0 text-xl font-bold">4. Vision</h2>
        <p className="m-0">
          Hardest learners first → durable adaptive tutor → path to a full Primer for every child.
        </p>
      </Card>
    </main>
  );
}
