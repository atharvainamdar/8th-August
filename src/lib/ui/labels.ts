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

export function presentationLabel(modality: string, scaffold: string): string {
  const how =
    modality === "audio" || modality === "speak" || modality === "avatar"
      ? "Lumi will say it"
      : modality === "video_model"
        ? "Lumi will show a demo"
        : modality === "manipulative"
          ? "Let's move the pieces"
          : "Lumi will show it";
  const help =
    scaffold === "model"
      ? "We'll do it together first"
      : scaffold === "guided"
        ? "Extra help is on"
        : "You can try on your own";
  return `${how} · ${help}`;
}

export function adaptationMessage(action: string): string | null {
  switch (action) {
    case "increase_scaffold":
      return "That was tricky — I'll help more.";
    case "switch_modality":
      return "Let's try a different way.";
    case "offer_break":
      return "Let's take a calm break.";
    case "decrease_scaffold":
      return "You're getting stronger — a bit more independence.";
    case "change_skill":
      return "Let's try a new one.";
    case "celebrate":
      return "Awesome progress!";
    default:
      return null;
  }
}
