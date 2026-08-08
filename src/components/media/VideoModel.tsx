"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

/** Lightweight animated “video model” demos — no external video hosting required. */
export function VideoModel({
  kind,
  label,
  autoPlay = false,
}: {
  kind: "letter" | "blend" | "ten_frame" | "equal_groups";
  label: string;
  autoPlay?: boolean;
}) {
  const [playing, setPlaying] = useState(autoPlay);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) return;
    setStep(0);
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 700);
    return () => clearInterval(id);
  }, [playing, kind, label]);

  return (
    <div className="space-y-3 rounded-3xl border-2 border-[color:var(--border)] bg-[#f7fbf9] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="m-0 font-semibold">Watch the model</p>
        <Button type="button" variant="secondary" onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause" : "Play video model"}
        </Button>
      </div>
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-white">
        {kind === "letter" && (
          <div
            className="text-7xl font-bold"
            style={{
              transform: playing ? `scale(${1 + step * 0.04})` : "scale(1)",
              opacity: playing ? 0.55 + step * 0.15 : 1,
              transition: "transform 0.6s ease, opacity 0.6s ease",
              color: "var(--primary)",
            }}
          >
            {label}
          </div>
        )}
        {kind === "blend" && (
          <div className="flex gap-3 text-4xl font-bold">
            {label.split("").map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                style={{
                  transform: playing && step === i % 4 ? "translateY(-8px)" : "none",
                  color: playing && step === i % 4 ? "var(--accent)" : "var(--fg)",
                  transition: "all 0.4s ease",
                }}
              >
                {ch}
              </span>
            ))}
          </div>
        )}
        {kind === "ten_frame" && (
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-lg border-2 border-[color:var(--border)]"
                style={{
                  background:
                    playing && i < Number(label || 0) && i <= step + Number(label) / 4
                      ? "#cde7df"
                      : i < Number(label || 0) && !playing
                        ? "#cde7df"
                        : "white",
                }}
              />
            ))}
          </div>
        )}
        {kind === "equal_groups" && (
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, g) => (
              <div key={g} className="flex gap-1 rounded-xl border p-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      opacity: playing ? (step >= g ? 1 : 0.25) : 1,
                      transition: "opacity 0.4s ease",
                    }}
                  >
                    ●
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="m-0 text-sm text-[color:var(--muted)]">
        Short model. You start it. No sudden autoplay.
      </p>
    </div>
  );
}
