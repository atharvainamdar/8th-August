"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
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

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    router.push(`/?created=${json.profile.id}`);
  };

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-6">
      <h1 className="text-3xl font-bold">Set up a learner</h1>
      <p className="text-[color:var(--muted)]">
        Adults complete this once. Students use the home screen after that.
      </p>
      <Card className="mt-4 space-y-4">
        <label className="block space-y-1">
          <span className="font-semibold">Name</span>
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
          {saving ? "Saving..." : "Save profile"}
        </Button>
      </Card>
    </main>
  );
}
