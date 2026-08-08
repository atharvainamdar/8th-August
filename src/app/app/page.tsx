import Link from "next/link";
import { listProfiles } from "@/lib/db/profile";
import { Card } from "@/components/ui/Card";
import { HomeClient } from "@/components/home/HomeClient";
import { OnboardingTip } from "@/components/home/OnboardingTip";

export const dynamic = "force-dynamic";

export default async function KidAppHomePage() {
  const profiles = await listProfiles();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 md:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-sm font-semibold uppercase tracking-wide text-[color:var(--muted)]">
            Hi friend
          </p>
          <h1 className="m-0 text-4xl font-bold">Lumi</h1>
        </div>
        <Link className="text-sm font-semibold text-[color:var(--muted)] underline" href="/parents">
          Parent hub
        </Link>
      </header>

      <OnboardingTip />
      <Card className="mb-6">
        <h2 className="mt-0 text-2xl font-bold">Let&apos;s practice</h2>
        <p className="m-0 text-[color:var(--muted)]">
          Pick your name, tap how you feel, then press Start.
        </p>
      </Card>

      {profiles.length === 0 ? (
        <Card className="space-y-3">
          <p className="m-0">A grown-up needs to make your profile first.</p>
          <Link className="lumi-btn lumi-btn-primary inline-flex" href="/setup">
            Grown-up setup
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
            streakDays: p.streakDays,
            stars: p.stars,
          }))}
        />
      )}
    </main>
  );
}
