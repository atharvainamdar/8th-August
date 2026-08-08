import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function GuidePage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <Link className="lumi-btn lumi-btn-ghost inline-flex" href="/">
        Back
      </Link>
      <h1 className="text-3xl font-bold">Tonight&apos;s parent guide</h1>
      <Card className="space-y-2">
        <h2 className="mt-0 text-xl font-bold">5-minute setup</h2>
        <ol>
          <li>Open Lumi and create your child profile.</li>
          <li>Pick sensory mode (start with Calm if unsure).</li>
          <li>Pick a special interest.</li>
          <li>Let your child tap the mood check.</li>
        </ol>
      </Card>
      <Card className="space-y-2">
        <h2 className="mt-0 text-xl font-bold">During practice</h2>
        <ul>
          <li>Sit nearby the first few times. Do not take over the answers.</li>
          <li>If your child is stuck, wait — Lumi will add help or switch mode.</li>
          <li>Calm Corner is always available. That is success, not failure.</li>
          <li>Keep sessions to about 12–15 minutes.</li>
        </ul>
      </Card>
      <Card className="space-y-2">
        <h2 className="mt-0 text-xl font-bold">After practice</h2>
        <ul>
          <li>Open Parent hub for streaks and mastery.</li>
          <li>Celebrate effort, not perfection.</li>
          <li>Repeat 4–5 days this week for compounding gains.</li>
        </ul>
      </Card>
      <Link className="lumi-btn lumi-btn-primary inline-flex" href="/setup">
        Start free trial
      </Link>
    </main>
  );
}
