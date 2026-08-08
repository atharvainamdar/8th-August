"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function OnboardingTip() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(localStorage.getItem("lumi-onboarded") !== "1");
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <Card className="mb-4 space-y-3 border-2 border-[color:var(--primary)]">
      <h2 className="m-0 text-xl font-bold">Quick start for kids</h2>
      <ol className="m-0 pl-5">
        <li>Pick your name.</li>
        <li>Tap how you feel.</li>
        <li>Start Today&apos;s plan or Reading / Writing / Math.</li>
        <li>Use Calm Corner anytime.</li>
      </ol>
      <Button
        onClick={() => {
          localStorage.setItem("lumi-onboarded", "1");
          setShow(false);
        }}
      >
        Got it
      </Button>
    </Card>
  );
}
