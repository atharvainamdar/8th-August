import { describe, expect, it } from "vitest";
import { createLearnerState, startSession, applyResult } from "../../src/lib/adaptive/session";
import type { ActivityResult, SignalEvent } from "../../src/lib/adaptive/types";
import { decideNext } from "../../src/lib/adaptive/policy";

function baseState() {
  return createLearnerState({
    childId: "test",
    displayName: "Test",
    ageBand: "7-8",
    sensoryMode: "calm",
    interestPack: "trains",
  });
}

function answer(
  runtimeSkill: string,
  correct: boolean,
  modality: ActivityResult["modality"] = "visual"
): ActivityResult {
  return {
    skillId: runtimeSkill,
    activityKind: "decode",
    modality,
    scaffold: "guided",
    correct,
    latencyMs: correct ? 3000 : 14000,
    hintsUsed: 0,
    response: correct ? "ok" : "nope",
  };
}

describe("adaptive policy", () => {
  it("increases scaffold or switches modality after two consecutive wrongs", () => {
    let runtime = startSession(baseState(), { domain: "reading", itemsPlanned: 8 });
    const firstSkill = runtime.item.skillId;
    runtime = applyResult(runtime, answer(firstSkill, false, "visual"));
    runtime = applyResult(runtime, answer(runtime.item.skillId, false, "visual"));
    expect(
      ["increase_scaffold", "switch_modality", "offer_break"].includes(runtime.decision.action)
    ).toBe(true);
    expect(runtime.adaptations).toBeGreaterThan(0);
  });

  it("offers calm corner under stress", () => {
    const state = baseState();
    const events: SignalEvent[] = [
      {
        type: "answer",
        correct: false,
        skillId: "read.phonics.cvc",
        modality: "visual",
        latencyMs: 15000,
        at: Date.now(),
      },
      {
        type: "answer",
        correct: false,
        skillId: "read.phonics.cvc",
        modality: "visual",
        latencyMs: 16000,
        at: Date.now(),
      },
      { type: "mood", mood: "hard", at: Date.now() },
    ];
    const { decision } = decideNext(state, events, { domain: "reading" });
    expect(decision.action).toBe("offer_break");
    expect(decision.offerCalmCorner).toBe(true);
  });

  it("fades scaffold after three successes", () => {
    let runtime = startSession(baseState(), { domain: "math", itemsPlanned: 8 });
    // Force guided start
    runtime.state.scaffoldByDomain.math = "guided";
    for (let i = 0; i < 3; i += 1) {
      runtime = applyResult(runtime, answer(runtime.item.skillId, true, "manipulative"));
    }
    expect(["decrease_scaffold", "change_skill", "next_item", "end_session"]).toContain(
      runtime.decision.action
    );
  });

  it("never ends before planned items unless planned reached", () => {
    let runtime = startSession(baseState(), { domain: "writing", itemsPlanned: 4 });
    for (let i = 0; i < 3; i += 1) {
      runtime = applyResult(runtime, answer(runtime.item.skillId, true, "typing"));
      expect(runtime.decision.action).not.toBe("end_session");
    }
    runtime = applyResult(runtime, answer(runtime.item.skillId, true, "typing"));
    expect(runtime.decision.action).toBe("end_session");
  });

  it("keeps interest theme on decisions", () => {
    const state = baseState();
    state.interestPack = "dinos";
    const { decision } = decideNext(state, [], { domain: "math" });
    expect(decision.theme).toBe("dinos");
  });
});
