import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-4 px-4 py-6">
      <Link className="lumi-btn lumi-btn-ghost inline-flex" href="/">
        Back
      </Link>
      <h1 className="text-3xl font-bold">Contact / Support</h1>
      <Card className="space-y-3">
        <p>
          For family onboarding, educator pilots, or data export help, email{" "}
          <strong>hello@lumi.tutor</strong> (placeholder support inbox for demos).
        </p>
        <p className="text-[color:var(--muted)]">
          Include your parent email and child first name. We respond for pilot partners and YC demo
          follow-ups.
        </p>
        <Link className="lumi-btn lumi-btn-primary inline-flex" href="/setup">
          Start free trial
        </Link>
      </Card>
    </main>
  );
}
