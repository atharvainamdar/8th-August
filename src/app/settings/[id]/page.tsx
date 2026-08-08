"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: "",
    sensoryMode: "balanced",
    interestPack: "space",
    dyslexiaFont: false,
    soundEnabled: true,
    motionEnabled: true,
    celebrationLevel: "medium",
    sessionMinutes: 15,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void fetch(`/api/profiles/${params.id}`)
      .then((r) => r.json())
      .then((j) => {
        const p = j.profile;
        setForm({
          displayName: p.displayName,
          sensoryMode: p.sensoryMode,
          interestPack: p.interestPack,
          dyslexiaFont: p.dyslexiaFont,
          soundEnabled: p.soundEnabled,
          motionEnabled: p.motionEnabled,
          celebrationLevel: p.celebrationLevel,
          sessionMinutes: p.sessionMinutes,
        });
      });
  }, [params.id]);

  const save = async () => {
    await fetch(`/api/profiles/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap gap-2">
        <Link className="lumi-btn lumi-btn-ghost" href={`/app?focus=${params.id}`}>
          Back
        </Link>
        <Link className="lumi-btn lumi-btn-ghost" href={`/parents?childId=${params.id}`}>
          Parent hub
        </Link>
      </div>
      <h1 className="text-3xl font-bold">Learner settings</h1>
      <Card className="space-y-3">
        <label className="block space-y-1">
          <span className="font-semibold">Name</span>
          <input
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
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
        <label className="block space-y-1">
          <span className="font-semibold">Session minutes</span>
          <input
            type="number"
            min={8}
            max={25}
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={form.sessionMinutes}
            onChange={(e) => setForm({ ...form, sessionMinutes: Number(e.target.value) })}
          />
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
        <Button onClick={save}>{saved ? "Saved" : "Save settings"}</Button>
        <Button variant="secondary" onClick={() => router.push(`/place?childId=${params.id}`)}>
          Re-run placement
        </Button>
      </Card>
    </main>
  );
}
