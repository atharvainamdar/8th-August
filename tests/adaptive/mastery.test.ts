import { describe, expect, it } from "vitest";
import {
  createMastery,
  isMastered,
  masteryMean,
  updateMastery,
} from "../../src/lib/adaptive/mastery";

describe("mastery", () => {
  it("updates up on correct and down on incorrect", () => {
    let m = createMastery("read.phonics.cvc", 0.4);
    const before = masteryMean(m);
    m = updateMastery(m, true);
    expect(masteryMean(m)).toBeGreaterThan(before);
    const mid = masteryMean(m);
    m = updateMastery(m, false);
    expect(masteryMean(m)).toBeLessThan(mid);
  });

  it("requires confidence for mastery", () => {
    let m = createMastery("x", 0.9);
    expect(isMastered(m)).toBe(false);
    for (let i = 0; i < 8; i += 1) m = updateMastery(m, true);
    expect(isMastered(m)).toBe(true);
  });
});
