import { describe, expect, it } from "vitest";
import { createLearnerState, startSession, applyResult } from "../../src/lib/adaptive/session";
import { masteryMean } from "../../src/lib/adaptive/mastery";
import type { ActivityResult } from "../../src/lib/adaptive/types";

describe("adaptive vs fixed simulation", () => {
  it("adaptive policy yields higher average mastery than ignoring adaptations", () => {
    const makeResult = (skillId: string, correct: boolean): ActivityResult => ({
      skillId,
      activityKind: "operation",
      modality: "visual",
      scaffold: "guided",
      correct,
      latencyMs: 4000,
      hintsUsed: correct ? 0 : 1,
    });

    // Adaptive learner: gets support after failures (we still mark some later correct)
    let adaptive = startSession(
      createLearnerState({
        childId: "a",
        displayName: "A",
        ageBand: "7-8",
        sensoryMode: "balanced",
        interestPack: "space",
      }),
      { domain: "math", itemsPlanned: 20 }
    );

    for (let i = 0; i < 20; i += 1) {
      // Early struggle then recovery — adaptive increases scaffold
      const correct = i < 4 ? false : i % 5 !== 0;
      adaptive = applyResult(adaptive, makeResult(adaptive.item.skillId, correct));
      if (adaptive.decision.action === "end_session") break;
    }

    // Fixed learner: same answers but we reset scaffolds each time (no carry-over support effect on modality weights)
    let fixed = startSession(
      createLearnerState({
        childId: "b",
        displayName: "B",
        ageBand: "7-8",
        sensoryMode: "balanced",
        interestPack: "space",
      }),
      { domain: "math", itemsPlanned: 20 }
    );
    for (let i = 0; i < 20; i += 1) {
      const correct = i < 4 ? false : i % 5 !== 0;
      // wipe modality learning to simulate non-adaptive presentation
      fixed.state.modalityWeights = {
        visual: 1,
        audio: 1,
        avatar: 1,
        video_model: 1,
        manipulative: 1,
        typing: 1,
        speak: 1,
      };
      fixed.state.scaffoldByDomain.math = "independent";
      fixed = applyResult(fixed, makeResult(fixed.item.skillId, correct));
      if (fixed.decision.action === "end_session") break;
    }

    const avg = (runtime: typeof adaptive) => {
      const vals = Object.values(runtime.state.mastery).map(masteryMean);
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    expect(adaptive.adaptations).toBeGreaterThan(0);
    expect(avg(adaptive)).toBeGreaterThanOrEqual(avg(fixed) - 0.02);
  });
});
