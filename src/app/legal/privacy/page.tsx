import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <Link className="lumi-btn lumi-btn-ghost inline-flex" href="/">
        Back
      </Link>
      <h1 className="text-3xl font-bold">Privacy</h1>
      <Card className="space-y-3">
        <p>
          Lumi is an educational practice product for families. We store learner profiles, practice
          events, and mastery progress so the tutor can adapt and parents can see growth.
        </p>
        <p>
          We do not sell child data. Photos used for homework help are processed to generate a short
          coaching step and are not used to train public models in this product.
        </p>
        <p>
          Parents control profiles and can export or delete practice data by contacting support.
          This is not a clinical or medical service.
        </p>
      </Card>
    </main>
  );
}
