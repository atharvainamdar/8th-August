"use client";

import { useEffect, useState } from "react";

export function SessionTimer({
  minutes = 15,
  running = true,
}: {
  minutes?: number;
  running?: boolean;
}) {
  const [left, setLeft] = useState(minutes * 60);

  useEffect(() => {
    setLeft(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const m = Math.floor(left / 60);
  const s = left % 60;
  const nearEnd = left > 0 && left <= 60;

  return (
    <div
      className="rounded-2xl px-3 py-2 text-sm font-bold"
      style={{
        background: nearEnd ? "#ffe8d6" : "#eef5f1",
        color: "var(--fg)",
      }}
      aria-label="Session timer"
    >
      ⏱ {m}:{String(s).padStart(2, "0")}
      {left === 0 ? " · time for a break" : nearEnd ? " · almost done" : ""}
    </div>
  );
}
