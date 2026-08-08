import type { InterestPack, SensoryMode } from "@/lib/adaptive/types";

const INTEREST: Record<InterestPack, { emoji: string; label: string }> = {
  trains: { emoji: "🚂", label: "trains" },
  space: { emoji: "🚀", label: "space" },
  dinos: { emoji: "🦕", label: "dinosaurs" },
  animals: { emoji: "🐾", label: "animals" },
  ocean: { emoji: "🌊", label: "ocean" },
};

const SENSORY: Record<SensoryMode, string> = {
  calm: "Calm screen",
  balanced: "Balanced screen",
  bright: "Bright screen",
};

export function interestLabel(pack: string) {
  const hit = INTEREST[pack as InterestPack];
  return hit ? `${hit.emoji} ${hit.label}` : pack;
}

export function sensoryLabel(mode: string) {
  return SENSORY[mode as SensoryMode] ?? mode;
}

export const SUBJECTS = [
  { id: "reading" as const, emoji: "📖", label: "Reading" },
  { id: "writing" as const, emoji: "✏️", label: "Writing" },
  { id: "math" as const, emoji: "🔢", label: "Math" },
];
