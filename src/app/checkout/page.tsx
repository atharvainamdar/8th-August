"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  const plan = (params.get("plan") as keyof typeof PLANS) || "trial";
  const selected = PLANS[plan] ?? PLANS.trial;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <main className="mx-auto min-h-screen max-w-xl space-y-4 px-4 py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <Card className="space-y-3">
        <h2 className="mt-0 text-xl font-bold">{selected.label}</h2>
        <p className="m-0 text-3xl font-bold">{selected.price}</p>
        <p className="m-0 text-[color:var(--muted)]">{selected.detail}</p>
        {!done ? (
          <>
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
              Card payments can connect to Stripe next. For now, start instantly and set up your child.
            </p>
            <Button
              disabled={!email.includes("@")}
              onClick={() => setDone(true)}
            >
              Confirm {selected.label}
            </Button>
          </>
        ) : (
          <>
            <p className="font-semibold">You&apos;re in. Next: create your child profile.</p>
            <Link
              className="lumi-btn lumi-btn-primary inline-flex"
              href={`/setup?plan=${plan}&email=${encodeURIComponent(email)}`}
            >
              Continue to setup
            </Link>
          </>
        )}
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
