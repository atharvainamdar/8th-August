import type { LearnerState, RegulationState, SignalEvent } from "./types";

export interface SignalSummary {
  recentWrong: number;
  recentCorrect: number;
  consecutiveWrong: number;
  consecutiveCorrect: number;
  avgLatencyMs: number;
  hintCount: number;
  skipCount: number;
  rageClicks: number;
  exitAttempts: number;
  stressed: boolean;
}

export function summarizeSignals(events: SignalEvent[], window = 8): SignalSummary {
  const slice = events.slice(-window);
  let recentWrong = 0;
  let recentCorrect = 0;
  let hintCount = 0;
  let skipCount = 0;
  let rageClicks = 0;
  let exitAttempts = 0;
  const latencies: number[] = [];

  for (const e of slice) {
    if (e.type === "answer") {
      if (e.correct) recentCorrect += 1;
      else recentWrong += 1;
      if (typeof e.latencyMs === "number") latencies.push(e.latencyMs);
    }
    if (e.type === "hint") hintCount += 1;
    if (e.type === "skip") skipCount += 1;
    if (e.type === "rage_click") rageClicks += 1;
    if (e.type === "exit_attempt") exitAttempts += 1;
    if (e.type === "latency" && typeof e.latencyMs === "number") {
      latencies.push(e.latencyMs);
    }
  }

  let consecutiveWrong = 0;
  let consecutiveCorrect = 0;
  for (let i = events.length - 1; i >= 0; i -= 1) {
    const e = events[i];
    if (e.type !== "answer") continue;
    if (e.correct) {
      if (consecutiveWrong > 0) break;
      consecutiveCorrect += 1;
    } else {
      if (consecutiveCorrect > 0) break;
      consecutiveWrong += 1;
    }
  }

  const avgLatencyMs =
    latencies.length > 0
      ? latencies.reduce((a, b) => a + b, 0) / latencies.length
      : 0;

  const stressed =
    consecutiveWrong >= 2 ||
    rageClicks >= 2 ||
    exitAttempts >= 1 ||
    (recentWrong >= 3 && avgLatencyMs > 12000) ||
    slice.some((e) => e.type === "mood" && e.mood === "hard");

  return {
    recentWrong,
    recentCorrect,
    consecutiveWrong,
    consecutiveCorrect,
    avgLatencyMs,
    hintCount,
    skipCount,
    rageClicks,
    exitAttempts,
    stressed,
  };
}

export function deriveRegulation(
  state: LearnerState,
  summary: SignalSummary
): RegulationState {
  if (summary.stressed || state.regulation === "stressed") {
    if (summary.consecutiveCorrect >= 2 && summary.rageClicks === 0) return "ok";
    return "stressed";
  }
  if (summary.consecutiveCorrect >= 3 && summary.avgLatencyMs < 6000) return "calm";
  return "ok";
}

export function applyModalityWeight(
  state: LearnerState,
  modality: NonNullable<SignalEvent["modality"]>,
  success: boolean
): LearnerState {
  const current = state.modalityWeights[modality] ?? 1;
  const next = success
    ? Math.min(3, current + 0.15)
    : Math.max(0.25, current - 0.2);
  return {
    ...state,
    modalityWeights: { ...state.modalityWeights, [modality]: next },
  };
}
