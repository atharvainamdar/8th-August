import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const PLAN_AMOUNTS: Record<string, number> = {
  trial: 0,
  monthly: 2900,
  yearly: 19900,
};

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").toLowerCase().trim();
  const plan = String(body.plan || "trial");
  const name = String(body.name || "Parent");
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!(plan in PLAN_AMOUNTS)) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const parent = await prisma.parentAccount.upsert({
    where: { email },
    create: { email, name, plan },
    update: { name, plan },
  });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && plan !== "trial") {
    // Ready for Stripe Checkout Session creation when keys are present.
    return NextResponse.json({
      mode: "stripe_ready",
      message:
        "Stripe key detected. Configure price IDs to enable hosted checkout. Parent account saved for trial-style access meanwhile.",
      parent,
      amount: PLAN_AMOUNTS[plan],
      continueUrl: `/setup?plan=${plan}&email=${encodeURIComponent(email)}`,
    });
  }

  return NextResponse.json({
    mode: "instant",
    parent,
    continueUrl: `/setup?plan=${plan}&email=${encodeURIComponent(email)}`,
  });
}
