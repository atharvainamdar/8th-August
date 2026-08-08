import Link from "next/link";
import { listProfiles } from "@/lib/db/profile";
import { Card } from "@/components/ui/Card";
import { HomeClient } from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const profiles = await listProfiles();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 md:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-sm font-semibold uppercase tracking-wide text-[color:var(--muted)]">
            Adaptive AI Tutor
          </p>
          <h1 className="m-0 text-4xl font-bold">Lumi</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          <Link className="lumi-btn lumi-btn-secondary" href="/setup">
            New profile
          </Link>
          <Link className="lumi-btn lumi-btn-ghost" href="/demo">
            YC demo
          </Link>
          <Link className="lumi-btn lumi-btn-ghost" href="/adult">
            Adult view
          </Link>
        </nav>
      </header>

      <Card className="mb-6">
        <h2 className="mt-0 text-2xl font-bold">Choose who is learning</h2>
        <p className="text-[color:var(--muted)]">
          Students are the main users. Pick a profile, check how you feel, then practice with Lumi.
        </p>
      </Card>

      {profiles.length === 0 ? (
        <Card>
          <p>No profiles yet. Create one to begin.</p>
          <Link className="lumi-btn lumi-btn-primary inline-flex" href="/setup">
            Create profile
          </Link>
        </Card>
      ) : (
        <HomeClient
          profiles={profiles.map((p) => ({
            id: p.id,
            displayName: p.displayName,
            ageBand: p.ageBand,
            sensoryMode: p.sensoryMode,
            interestPack: p.interestPack,
            placed: p.placed,
          }))}
        />
      )}
    </main>
  );
}
