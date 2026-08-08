import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
            style={{ background: "radial-gradient(circle at 30% 30%, #ffe8a3, #f4b942 55%, #e07a5f)" }}
          >
            L
          </div>
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">
              Calm homework help for ages 7–10
            </p>
            <h1 className="m-0 text-2xl font-bold">Lumi</h1>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          <a className="lumi-btn lumi-btn-ghost" href="#how">
            How it works
          </a>
          <a className="lumi-btn lumi-btn-ghost" href="#pricing">
            Pricing
          </a>
          <Link className="lumi-btn lumi-btn-primary" href="/setup">
            I&apos;m a parent
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <p className="lumi-chip">Reading · Writing · Math practice</p>
          <h2 className="m-0 text-4xl font-bold leading-tight md:text-5xl">
            Homework help your child can do alone for 15 calm minutes.
          </h2>
          <p className="m-0 text-lg text-[color:var(--muted)]">
            Lumi is a friendly one-on-one tutor for autistic kids. It helps with reading, writing,
            and math — and makes practice easier when things feel hard.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              className="lumi-btn lumi-btn-primary justify-center px-6 py-4 text-lg"
              href="/setup"
            >
              I&apos;m a parent — set up
            </Link>
            <Link
              className="lumi-btn lumi-btn-secondary justify-center px-6 py-4 text-lg"
              href="/app"
            >
              I&apos;m a student — start
            </Link>
          </div>
          <ul className="m-0 grid gap-2 p-0 text-base" style={{ listStyle: "none" }}>
            <li>✓ Short sessions that finish cleanly</li>
            <li>✓ Voice, pictures, and video examples</li>
            <li>✓ Calm Corner anytime if practice feels too much</li>
            <li>✓ Parents see simple weekly progress</li>
          </ul>
        </div>
        <div className="lumi-card space-y-4 p-6">
          <h3 className="m-0 text-xl font-bold">What parents get</h3>
          <div className="grid gap-3">
            {[
              ["15 quiet minutes", "Your child practices while you step away"],
              ["Help that flexes", "Lumi gives more support when they struggle"],
              ["Built around interests", "Trains, space, dinos, animals, ocean"],
              ["Clear progress", "Streaks, stars, and a simple weekly report"],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-[#eef5f1] p-4">
                <p className="m-0 font-bold">{t}</p>
                <p className="m-0 text-[color:var(--muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mt-0 text-3xl font-bold">Built for real family nights</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [
              "Less homework fighting",
              "A calm helper that finishes practice without a battle every night.",
            ],
            [
              "Skills that move",
              "Reading, writing, and math practice you can actually see improve.",
            ],
            [
              "A way out when it is hard",
              "Kids can pause, take a calm break, or ask for an easier step anytime.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="lumi-card p-5">
              <h3 className="mt-0 text-lg font-bold">{t}</h3>
              <p className="m-0 text-[color:var(--muted)]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="border-y border-[color:var(--border)] bg-white/60 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mt-0 text-3xl font-bold">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["1. Parent sets up once", "Tell Lumi about your child in about 2 minutes."],
              ["2. Child practices", "About 15 minutes. Lumi guides. Kid can pause anytime."],
              ["3. You see how it went", "Open the parent hub for streaks and growth."],
            ].map(([t, d]) => (
              <div key={t} className="lumi-card p-5">
                <h3 className="mt-0 text-lg font-bold">{t}</h3>
                <p className="m-0 text-[color:var(--muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-[color:var(--border)] bg-white/60 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mt-0 text-3xl font-bold">Simple pricing for families</h2>
          <p className="text-[color:var(--muted)]">
            Cheaper than one tutoring session. Built for daily practice.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="lumi-card p-6">
              <h3 className="mt-0 text-xl font-bold">Free trial</h3>
              <p className="text-3xl font-bold">$0</p>
              <p className="text-[color:var(--muted)]">7 days · 1 child · full practice</p>
              <Link className="lumi-btn lumi-btn-secondary mt-4 inline-flex" href="/setup">
                Start free today
              </Link>
            </div>
            <div className="lumi-card border-2 border-[color:var(--primary)] p-6">
              <p className="lumi-chip">Most families</p>
              <h3 className="mt-2 text-xl font-bold">Monthly</h3>
              <p className="text-3xl font-bold">
                $29<span className="text-base font-semibold">/mo</span>
              </p>
              <p className="text-[color:var(--muted)]">
                Unlimited practice · progress reports · 2 children
              </p>
              <Link
                className="lumi-btn lumi-btn-primary mt-4 inline-flex"
                href="/checkout?plan=monthly"
              >
                Choose monthly
              </Link>
            </div>
            <div className="lumi-card p-6">
              <h3 className="mt-0 text-xl font-bold">Yearly</h3>
              <p className="text-3xl font-bold">
                $199<span className="text-base font-semibold">/yr</span>
              </p>
              <p className="text-[color:var(--muted)]">Best value · share with teachers · support</p>
              <Link
                className="lumi-btn lumi-btn-secondary mt-4 inline-flex"
                href="/checkout?plan=yearly"
              >
                Choose yearly
              </Link>
            </div>
          </div>
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            Start free today. You can upgrade when your family is ready.
          </p>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-[color:var(--muted)]">
        <p className="m-0">Lumi · Homework practice tool · Not therapy</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/parents">Parent hub</Link>
          <Link href="/guide">Parent guide</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/app">Student app</Link>
          <Link href="/demo">Investor demo</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </main>
  );
}
