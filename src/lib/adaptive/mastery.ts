import type { MasteryState } from "./types";

/** Beta-Binomial mastery: mean = alpha / (alpha + beta) */
export function masteryMean(m: MasteryState): number {
  return m.alpha / (m.alpha + m.beta);
}

export function masteryConfidence(m: MasteryState): number {
  // Higher total observations => higher confidence (asymptotic to 1)
  const n = m.alpha + m.beta - 2;
  return 1 - Math.exp(-n / 8);
}

export function createMastery(skillId: string, priorMean = 0.35): MasteryState {
  // Weakly informative prior centered near priorMean
  const strength = 4;
  return {
    skillId,
    alpha: priorMean * strength,
    beta: (1 - priorMean) * strength,
  };
}

export function updateMastery(
  m: MasteryState,
  correct: boolean,
  partial = 1
): MasteryState {
  const weight = Math.min(1, Math.max(0.15, partial));
  if (correct) {
    return { ...m, alpha: m.alpha + weight };
  }
  return { ...m, beta: m.beta + weight };
}

export function isMastered(m: MasteryState, threshold = 0.8): boolean {
  return masteryMean(m) >= threshold && masteryConfidence(m) >= 0.45;
}

export function needsReview(m: MasteryState): boolean {
  return masteryMean(m) < 0.55 || (masteryMean(m) < 0.75 && masteryConfidence(m) < 0.35);
}

export function compareMastery(a: MasteryState, b: MasteryState): number {
  return masteryMean(a) - masteryMean(b);
}
