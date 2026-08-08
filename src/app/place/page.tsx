"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PlaceInner() {
  const params = useSearchParams();
  const router = useRouter();
  const childId = params.get("childId");
  const mood = params.get("mood") || "ok";

  useEffect(() => {
    if (!childId) return;
    // Mark placed after redirecting into a placement session
    void fetch(`/api/profiles/${childId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placed: true }),
    }).finally(() => {
      router.replace(`/learn?childId=${childId}&mood=${mood}&placement=1`);
    });
  }, [childId, mood, router]);

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Placement</h1>
        <p>Lumi will ask a few practice questions to find a good starting level.</p>
      </div>
    </main>
  );
}

export default function PlacePage() {
  return (
    <Suspense>
      <PlaceInner />
    </Suspense>
  );
}
