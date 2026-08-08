import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <Link className="lumi-btn lumi-btn-ghost inline-flex" href="/">
        Back
      </Link>
      <h1 className="text-3xl font-bold">Terms</h1>
      <Card className="space-y-3">
        <p>
          Lumi provides adaptive academic practice in reading, writing, and arithmetic. It is not
          therapy, diagnosis, or medical care.
        </p>
        <p>
          Parents are responsible for supervising young learners. Free trial and paid plans grant
          access to practice features and progress reports for the subscription period.
        </p>
        <p>
          Results vary by child. Practice metrics show educational progress inside the app and are
          not standardized clinical assessments.
        </p>
      </Card>
    </main>
  );
}
