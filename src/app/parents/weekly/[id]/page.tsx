"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

export default function WeeklyInAppPage() {
  const params = useParams<{ id: string }>();
  const [html, setHtml] = useState("Loading weekly report...");

  useEffect(() => {
    void fetch(`/api/report/weekly/${params.id}`)
      .then((r) => r.text())
      .then(setHtml)
      .catch(() => setHtml("Could not load report."));
  }, [params.id]);

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap gap-2">
        <Link className="lumi-btn lumi-btn-ghost" href="/parents">
          Back to parent hub
        </Link>
        <a className="lumi-btn lumi-btn-secondary" href={`/api/report/weekly/${params.id}`}>
          Open printable
        </a>
      </div>
      <h1 className="text-3xl font-bold">Weekly report</h1>
      <Card>
        <iframe
          title="Weekly report"
          className="min-h-[70vh] w-full rounded-xl border-0 bg-white"
          srcDoc={html}
        />
      </Card>
    </main>
  );
}
