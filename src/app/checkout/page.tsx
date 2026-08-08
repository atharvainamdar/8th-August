"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const PLANS = {
  trial: { label: "Free trial", price: "$0", detail: "7 days full access" },
  monthly: { label: "Monthly", price: "$29/mo", detail: "Unlimited practice · 2 children" },
  yearly: { label: "Yearly", price: "$199/yr", detail: "Best value · educator export" },
} as const;

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const plan = (params.get("plan") as keyof typeof PLANS) || "trial";
  const selected = PLANS[plan] ?? PLANS.trial;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, plan }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Checkout failed");
        setBusy(false);
        return;
      }
      router.push(json.continueUrl);
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-xl space-y-4 px-4 py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <Card className="space-y-3">
        <h2 className="mt-0 text-xl font-bold">{selected.label}</h2>
        <p className="m-0 text-3xl font-bold">{selected.price}</p>
        <p className="m-0 text-[color:var(--muted)]">{selected.detail}</p>
        <label className="block space-y-1">
          <span className="font-semibold">Parent name</span>
          <input
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-semibold">Parent email</span>
          <input
            className="w-full rounded-2xl border-2 border-[color:var(--border)] px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </label>
        <p className="text-sm text-[color:var(--muted)]">
          Instant access today. When Stripe keys are connected, paid plans can use hosted card checkout.
        </p>
        {error && <p className="text-[color:var(--warn)]">{error}</p>}
        <Button disabled={busy || !email.includes("@")} onClick={confirm}>
          {busy ? "Working..." : `Confirm ${selected.label}`}
        </Button>
      </Card>
      <Link className="lumi-btn lumi-btn-ghost inline-flex" href="/">
        Back
      </Link>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
