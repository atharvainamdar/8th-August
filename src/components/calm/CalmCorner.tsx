"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

export function CalmCorner({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const mod = count % 12;
    if (mod < 4) setPhase("in");
    else if (mod < 8) setPhase("hold");
    else setPhase("out");
  }, [count]);

  const label =
    phase === "in" ? "Breathe in" : phase === "hold" ? "Hold gently" : "Breathe out";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-bold">Calm Corner</h1>
      <p className="text-lg text-[color:var(--muted)]">
        You can rest here. No rush. When you feel ready, continue.
      </p>
      <div
        className="flex h-40 w-40 items-center justify-center rounded-full text-xl font-bold"
        style={{
          background: "radial-gradient(circle, #cde7df, #8fbfb0)",
          transform: phase === "in" ? "scale(1.08)" : phase === "out" ? "scale(0.92)" : "scale(1)",
          transition: "transform 1s linear",
        }}
      >
        {label}
      </div>
      <Button onClick={onDone}>I am ready</Button>
    </div>
  );
}
