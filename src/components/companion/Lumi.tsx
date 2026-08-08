"use client";

type Mood = "idle" | "talk" | "celebrate" | "calm";

export function LumiCompanion({
  mood = "idle",
  message,
  motionEnabled = true,
}: {
  mood?: Mood;
  message?: string;
  motionEnabled?: boolean;
}) {
  const face =
    mood === "celebrate" ? "^_^" : mood === "calm" ? "-_-" : mood === "talk" ? "o_o" : "u_u";

  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div
        className="relative flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, #ffe8a3, #f4b942 55%, #e07a5f)",
          boxShadow: motionEnabled ? "0 0 0 6px rgba(244,185,66,0.18)" : "none",
        }}
        aria-label="Lumi companion"
      >
        <span className="text-lg font-bold text-[#4a3208]">{face}</span>
        {mood === "talk" && motionEnabled && (
          <>
            <span className="absolute -bottom-1 h-2 w-4 animate-pulse rounded-full bg-[#4a3208]/opacity-70" />
            <span
              className="absolute inset-0 animate-ping rounded-full"
              style={{ border: "2px solid rgba(244,185,66,0.35)" }}
            />
          </>
        )}
      </div>
      {message ? (
        <div className="lumi-card max-w-md px-4 py-3 text-base leading-snug">
          <p className="m-0 font-semibold text-[color:var(--primary)]">Lumi</p>
          <p className="m-0 mt-1">{message}</p>
        </div>
      ) : null}
    </div>
  );
}
