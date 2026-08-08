"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { speakText, stopSpeaking } from "@/lib/audio/voice";

/** Step-by-step visual demo with optional Lumi narration (local TTS or ElevenLabs). */
export function VideoModel({
  kind,
  label,
  autoPlay = false,
  soundEnabled = true,
}: {
  kind: "letter" | "blend" | "ten_frame" | "equal_groups";
  label: string;
  autoPlay?: boolean;
  soundEnabled?: boolean;
}) {
  const [playing, setPlaying] = useState(autoPlay);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) {
      stopSpeaking();
      return;
    }
    setStep(0);
    const lines =
      kind === "letter"
        ? [`Watch the letter ${label}.`, "Trace the shape in your mind.", "Say it softly.", "Now you try."]
        : kind === "blend"
          ? ["Listen to each sound.", "Push the sounds together.", "Hear the whole word.", "Your turn."]
          : kind === "ten_frame"
            ? ["Watch the boxes fill.", "Count with me.", "See the total.", "Now you show it."]
            : ["See the equal groups.", "Count one group.", "Count all groups.", "You can do it."];
    if (soundEnabled) {
      stopSpeaking();
      void speakText(lines[0]!, { enabled: true, rate: 0.9 });
    }
    const id = setInterval(() => {
      setStep((s) => {
        const n = (s + 1) % 4;
        if (soundEnabled && n === 0) {
          // One short reminder each loop — avoid overlapping chatter
          stopSpeaking();
          void speakText("Your turn to try.", { enabled: true, rate: 0.9 });
        }
        return n;
      });
    }, 900);
    return () => {
      clearInterval(id);
      stopSpeaking();
    };
  }, [playing, kind, label, soundEnabled]);

  return (
    <div className="space-y-3 rounded-3xl border-2 border-[color:var(--border)] bg-[#f7fbf9] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="m-0 font-semibold">Watch Lumi show you</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "Pause" : "Play demo"}
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
                    i < Number(label || 0) && (playing ? i <= step * 3 : true)
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
              <div key={g} className="flex flex-col gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-full"
                    style={{
                      background:
                        playing && g <= step % 3 ? "var(--primary)" : "#d7e5e0",
                      transition: "background 0.4s ease",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        {playing && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full"
                style={{
                  background: i === step ? "var(--primary)" : "#c5d5cf",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
