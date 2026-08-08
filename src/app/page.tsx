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
              AI tutor for autistic kids
            </p>
            <h1 className="m-0 text-2xl font-bold">Lumi</h1>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          <a className="lumi-btn lumi-btn-ghost" href="#how">How it works</a>
          <a className="lumi-btn lumi-btn-ghost" href="#syllabus">Syllabus</a>
          <a className="lumi-btn lumi-btn-ghost" href="#pricing">Pricing</a>
          <Link className="lumi-btn lumi-btn-primary" href="/setup">Start free</Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <p className="lumi-chip">YC Primer wedge · Reading · Writing · Arithmetic</p>
          <h2 className="m-0 text-4xl font-bold leading-tight md:text-5xl">
            A calm 1:1 AI tutor that autistic kids actually want to open.
          </h2>
          <p className="m-0 text-lg text-[color:var(--muted)]">
            Lumi adapts difficulty, voice, visuals, video models, and support in real time —
            so homework practice gets done, skills grow, and parents get time back.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="lumi-btn lumi-btn-primary" href="/setup">
              Start free trial
            </Link>
            <Link className="lumi-btn lumi-btn-secondary" href="/app">
              Open student app
            </Link>
            <Link className="lumi-btn lumi-btn-ghost" href="/demo">
              See YC demo
            </Link>
          </div>
          <ul className="m-0 grid gap-2 p-0 text-base" style={{ listStyle: "none" }}>
            <li>✓ Science-of-reading + arithmetic syllabus for ages 7–10</li>
            <li>✓ Voice practice, video models, Calm Corner</li>
            <li>✓ Weekly progress parents and educators can trust</li>
            <li>✓ Not therapy. Not clinical. Pure skill practice that compounds.</li>
          </ul>
        </div>
        <div className="lumi-card space-y-4 p-6">
          <h3 className="m-0 text-xl font-bold">What parents get</h3>
          <div className="grid gap-3">
            {[
              ["15 focused minutes", "Short sessions that finish cleanly"],
              ["Real adaptation", "Scaffold + modality switch when stuck"],
              ["Special interests", "Trains, space, dinos, animals, ocean"],
              ["Measurable growth", "Mastery maps, streaks, weekly reports"],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-[#eef5f1] p-4">
                <p className="m-0 font-bold">{t}</p>
                <p className="m-0 text-[color:var(--muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-[color:var(--border)] bg-white/60 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mt-0 text-3xl font-bold">How Lumi works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["1. Setup once", "Sensory mode, interest, goals"],
              ["2. Placement", "Find the right skill level"],
              ["3. Daily practice", "Voice, video, manipulatives"],
              ["4. See growth", "Parent hub + weekly report"],
            ].map(([t, d]) => (
              <div key={t} className="lumi-card p-5">
                <h3 className="mt-0 text-lg font-bold">{t}</h3>
                <p className="m-0 text-[color:var(--muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="syllabus" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="m-0 text-3xl font-bold">8-week core syllabus</h2>
            <p className="text-[color:var(--muted)]">
              Skill-based, age-respectful. Reading, writing, and arithmetic intertwined.
            </p>
          </div>
          <Link className="lumi-btn lumi-btn-secondary" href="/syllabus">
            View full syllabus
          </Link>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            "Sounds → words",
            "Blend & build",
            "Fluency passages",
            "Comprehension",
            "Letters → sentences",
            "Number sense",
            "Word problems",
            "Showcase week",
          ].map((item) => (
            <div key={item} className="lumi-card p-4 font-semibold">
              {item}
            </div>
          ))}
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
              <p className="text-[color:var(--muted)]">7 days · 1 child · full syllabus access</p>
              <Link className="lumi-btn lumi-btn-secondary mt-4 inline-flex" href="/setup">
                Start trial
              </Link>
            </div>
            <div className="lumi-card border-2 border-[color:var(--primary)] p-6">
              <p className="lumi-chip">Most families</p>
              <h3 className="mt-2 text-xl font-bold">Monthly</h3>
              <p className="text-3xl font-bold">$29<span className="text-base font-semibold">/mo</span></p>
              <p className="text-[color:var(--muted)]">Unlimited practice · progress reports · 2 children</p>
              <Link className="lumi-btn lumi-btn-primary mt-4 inline-flex" href="/setup?plan=monthly">
                Choose monthly
              </Link>
            </div>
            <div className="lumi-card p-6">
              <h3 className="mt-0 text-xl font-bold">Yearly</h3>
              <p className="text-3xl font-bold">$199<span className="text-base font-semibold">/yr</span></p>
              <p className="text-[color:var(--muted)]">Best value · educator export · priority support</p>
              <Link className="lumi-btn lumi-btn-secondary mt-4 inline-flex" href="/setup?plan=yearly">
                Choose yearly
              </Link>
            </div>
          </div>
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            Payment can be connected later (Stripe). Trial unlocks the full product experience today.
          </p>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-[color:var(--muted)]">
        <p className="m-0">Lumi · Educational practice tool · Not clinical therapy</p>
        <div className="flex gap-3">
          <Link href="/parents">Parent hub</Link>
          <Link href="/docs/pilot">Pilot protocol</Link>
          <Link href="/app">Student app</Link>
        </div>
      </footer>
    </main>
  );
}
