import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function PilotProtocolPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <Link href="/adult" className="lumi-btn lumi-btn-ghost inline-flex">
        Back
      </Link>
      <h1 className="text-3xl font-bold">Specialist Pilot Protocol</h1>
      <Card className="space-y-3">
        <p>
          Lumi is an educational practice tutor, not a clinical or therapy tool. Use this protocol when
          testing with K-12 autistic learners.
        </p>
        <h2 className="text-xl font-bold">Cadence</h2>
        <ul>
          <li>2 weeks</li>
          <li>4–5 sessions per week</li>
          <li>12–15 minutes per session</li>
        </ul>
        <h2 className="text-xl font-bold">Setup</h2>
        <ul>
          <li>Create profile with sensory mode + interest pack</li>
          <li>Run placement once</li>
          <li>Prefer tablet, headphones optional, Calm mode if sensory-sensitive</li>
        </ul>
        <h2 className="text-xl font-bold">Success signals</h2>
        <ul>
          <li>Session completion rate</li>
          <li>Mastery mean deltas in reading/writing/math</li>
          <li>Scaffold fade over time</li>
          <li>Qualitative: fewer homework battles, child-initiated opens</li>
        </ul>
        <h2 className="text-xl font-bold">Export</h2>
        <p>Use Adult view → Export JSON/CSV after week 1 and week 2.</p>
      </Card>
    </main>
  );
}
