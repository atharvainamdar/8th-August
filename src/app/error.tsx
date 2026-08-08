"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="lumi-card max-w-md space-y-3 p-6 text-center">
        <h1 className="m-0 text-2xl font-bold">Something went wrong</h1>
        <p className="m-0 text-[color:var(--muted)]">
          Lumi hit a bump. You can try again or go home.
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Link className="lumi-btn lumi-btn-ghost" href="/">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
