"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function SetupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({
    parentName: "",
    parentEmail: "",
    plan: "trial",
    displayName: "",
    ageBand: "7-8",
    sensoryMode: "balanced",
    interestPack: "space",
    dyslexiaFont: false,
    soundEnabled: true,
    motionEnabled: true,
    celebrationLevel: "medium",
    sessionMinutes: 15,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const plan = params.get("plan");
    const email = params.get("email");
    setForm((f) => ({
      ...f,
      plan: plan || f.plan,
      parentEmail: email || f.parentEmail,
    }));
  }, [params]);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    router.push(`/app?created=${json.profile.id}`);
  };

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-6">
      <h1 className="text-3xl font-bold">Set up your family</h1>
      <p className="text-[color:var(--muted)]">
        Parents complete this once. Then your child uses the student app.
      </p>
      <Card className="mt-4 space-y-4">
        <label className="block space-y-1">
          <span className="font-semibold">Parent name</span>
          <input
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={form.parentName}
            onChange={(e) => setForm({ ...form, parentName: e.target.value })}
            placeholder="Your name"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-semibold">Parent email</span>
          <input
            type="email"
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={form.parentEmail}
            onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
            placeholder="you@email.com"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-semibold">Plan</span>
          <select
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
          >
            <option value="trial">Free trial (7 days)</option>
            <option value="monthly">Monthly $29</option>
            <option value="yearly">Yearly $199</option>
          </select>
        </label>
        <label className="block space-y-1">
          <span className="font-semibold">Child name</span>
          <input
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            placeholder="Child first name"
          />
        </label>

        <label className="block space-y-1">
          <span className="font-semibold">Age band</span>
          <select
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={form.ageBand}
            onChange={(e) => setForm({ ...form, ageBand: e.target.value })}
          >
            <option value="7-8">7–8</option>
            <option value="9-10">9–10</option>
          </select>
        </label>

        <label className="block space-y-1">
          <span className="font-semibold">Sensory mode</span>
          <select
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={form.sensoryMode}
            onChange={(e) => setForm({ ...form, sensoryMode: e.target.value })}
          >
            <option value="calm">Calm</option>
            <option value="balanced">Balanced</option>
            <option value="bright">Bright</option>
          </select>
        </label>

        <label className="block space-y-1">
          <span className="font-semibold">Special interest</span>
          <select
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={form.interestPack}
            onChange={(e) => setForm({ ...form, interestPack: e.target.value })}
          >
            <option value="space">Space</option>
            <option value="dinos">Dinosaurs</option>
            <option value="trains">Trains</option>
            <option value="animals">Animals</option>
            <option value="ocean">Ocean</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.dyslexiaFont}
            onChange={(e) => setForm({ ...form, dyslexiaFont: e.target.checked })}
          />
          Dyslexia-friendly font
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.soundEnabled}
            onChange={(e) => setForm({ ...form, soundEnabled: e.target.checked })}
          />
          Sound on
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.motionEnabled}
            onChange={(e) => setForm({ ...form, motionEnabled: e.target.checked })}
          />
          Motion on
        </label>

        <Button disabled={saving || !form.displayName.trim()} onClick={save}>
          {saving ? "Saving..." : "Save and open student app"}
        </Button>
      </Card>
    </main>
  );
}

export default function SetupPage() {
  return (
    <Suspense>
      <SetupInner />
    </Suspense>
  );
}
