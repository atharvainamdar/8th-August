import type { CoachInput, HintInput } from "../types";

const INTEREST_BITS: Record<string, string[]> = {
  trains: ["train tracks", "engines", "stations"],
  space: ["rockets", "stars", "planets"],
  dinos: ["dinosaurs", "fossils", "stomping feet"],
  animals: ["animals", "paws", "habitats"],
  ocean: ["waves", "shells", "sea friends"],
};

function themeBit(interest: string): string {
  const bits = INTEREST_BITS[interest] ?? ["your favorite things"];
  return bits[Math.floor(Math.random() * bits.length)]!;
}

export function localCoach(input: CoachInput): string {
  const bit = themeBit(input.interest);
  if (input.correct) {
    const lines = [
      `Nice work, ${input.childName}. That strategy on ${input.skillTitle} was clear — like lining up ${bit}.`,
      `Yes, ${input.childName}. You figured out ${input.skillTitle}. Keep that steady thinking.`,
      `Great try that worked, ${input.childName}. ${input.skillTitle} is getting stronger.`,
    ];
    return lines[Math.floor(Math.random() * lines.length)]!;
  }
  const lines = [
    `Good try, ${input.childName}. Let's take one small step on ${input.skillTitle}.`,
    `That was brave practice, ${input.childName}. We'll use more help with ${input.skillTitle}.`,
    `Okay, ${input.childName}. We'll look at ${input.skillTitle} another way — slow and clear.`,
  ];
  return lines[Math.floor(Math.random() * lines.length)]!;
}

export function localHint(input: HintInput): string {
  const bit = themeBit(input.interest);
  if (input.scaffold === "model") {
    return `${input.childName}, watch me first. Think of ${bit}, then copy one tiny step.`;
  }
  if (input.scaffold === "guided") {
    return `${input.childName}, I'll help. Look at the first part only — ignore the rest for now.`;
  }
  return `${input.childName}, try one careful step. You can ask for help anytime.`;
}

export function localVisionGuidance(): string {
  return "Tell me which problem number feels hard. We will solve only the first small step together.";
}
