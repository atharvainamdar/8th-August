import { describe, expect, it } from "vitest";
import { createLearnerState, startSession, applyResult } from "../../src/lib/adaptive/session";
import type { ActivityResult } from "../../src/lib/adaptive/types";

describe("placement session", () => {
  it("cycles distinct probe skills then ends", () => {
    let runtime = startSession(
      createLearnerState({
        childId: "p",
        displayName: "Pat",
        ageBand: "7-8",
        sensoryMode: "balanced",
        interestPack: "ocean",
      }),
      { placement: true }
    );
    expect(runtime.domain).toBe("placement");
    expect(runtime.placementIds?.length).toBeGreaterThan(3);
    const seen = new Set<string>();
    for (let i = 0; i < runtime.itemsPlanned; i += 1) {
      seen.add(runtime.item.skillId);
      const result: ActivityResult = {
        skillId: runtime.item.skillId,
        activityKind: runtime.item.activityKind,
        modality: runtime.item.modality,
        scaffold: runtime.item.scaffold,
        correct: i % 2 === 0,
        latencyMs: 2000,
        hintsUsed: 0,
      };
      runtime = applyResult(runtime, result);
    }
    expect(runtime.decision.action).toBe("end_session");
    expect(seen.size).toBe(runtime.itemsPlanned);
  });
});
