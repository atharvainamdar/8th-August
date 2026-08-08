import { prisma } from "./prisma";
import { createLearnerState } from "../adaptive/session";
import { ensureMasteryMap } from "../curriculum/skills";
import type { InterestPack, LearnerState, SensoryMode } from "../adaptive/types";
import { masteryMean } from "../adaptive/mastery";

export async function listProfiles() {
  return prisma.childProfile.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getProfile(id: string) {
  return prisma.childProfile.findUnique({
    where: { id },
    include: { mastery: true, sessions: { orderBy: { startedAt: "desc" }, take: 20 } },
  });
}

export async function createProfile(input: {
  displayName: string;
  ageBand: string;
  sensoryMode: SensoryMode;
  interestPack: InterestPack;
  dyslexiaFont?: boolean;
  soundEnabled?: boolean;
  motionEnabled?: boolean;
  celebrationLevel?: "off" | "low" | "medium";
  sessionMinutes?: number;
}) {
  return prisma.childProfile.create({
    data: {
      displayName: input.displayName,
      ageBand: input.ageBand,
      sensoryMode: input.sensoryMode,
      interestPack: input.interestPack,
      dyslexiaFont: input.dyslexiaFont ?? false,
      soundEnabled: input.soundEnabled ?? true,
      motionEnabled: input.motionEnabled ?? true,
      celebrationLevel: input.celebrationLevel ?? "medium",
      sessionMinutes: input.sessionMinutes ?? 15,
    },
  });
}

export async function learnerStateFromProfile(id: string): Promise<LearnerState> {
  const profile = await prisma.childProfile.findUniqueOrThrow({
    where: { id },
    include: { mastery: true },
  });
  const mastery = ensureMasteryMap(
    Object.fromEntries(
      profile.mastery.map((m) => [
        m.skillId,
        { skillId: m.skillId, alpha: m.alpha, beta: m.beta },
      ])
    )
  );
  return createLearnerState({
    childId: profile.id,
    displayName: profile.displayName,
    ageBand: profile.ageBand,
    sensoryMode: profile.sensoryMode as SensoryMode,
    interestPack: profile.interestPack as InterestPack,
    dyslexiaFont: profile.dyslexiaFont,
    soundEnabled: profile.soundEnabled,
    motionEnabled: profile.motionEnabled,
    celebrationLevel: profile.celebrationLevel as LearnerState["celebrationLevel"],
    sessionMinutes: profile.sessionMinutes,
    mastery,
  });
}

export async function persistLearnerState(state: LearnerState) {
  const entries = Object.values(state.mastery);
  await prisma.$transaction(
    entries.map((m) =>
      prisma.skillMastery.upsert({
        where: { childId_skillId: { childId: state.childId, skillId: m.skillId } },
        create: {
          childId: state.childId,
          skillId: m.skillId,
          alpha: m.alpha,
          beta: m.beta,
        },
        update: { alpha: m.alpha, beta: m.beta },
      })
    )
  );
  await prisma.childProfile.update({
    where: { id: state.childId },
    data: {
      sensoryMode: state.sensoryMode,
      interestPack: state.interestPack,
      updatedAt: new Date(),
    },
  });
}

export async function progressSummary(childId: string) {
  const state = await learnerStateFromProfile(childId);
  const byDomain = {
    reading: [] as { id: string; mean: number }[],
    writing: [] as { id: string; mean: number }[],
    math: [] as { id: string; mean: number }[],
  };
  for (const [skillId, m] of Object.entries(state.mastery)) {
    const domain = skillId.startsWith("read")
      ? "reading"
      : skillId.startsWith("write")
        ? "writing"
        : "math";
    byDomain[domain].push({ id: skillId, mean: masteryMean(m) });
  }
  const avg = (arr: { mean: number }[]) =>
    arr.length ? arr.reduce((a, b) => a + b.mean, 0) / arr.length : 0;
  return {
    reading: avg(byDomain.reading),
    writing: avg(byDomain.writing),
    math: avg(byDomain.math),
    topGrowth: Object.entries(state.mastery)
      .map(([id, m]) => ({ id, mean: masteryMean(m) }))
      .sort((a, b) => b.mean - a.mean)
      .slice(0, 5),
    needsWork: Object.entries(state.mastery)
      .map(([id, m]) => ({ id, mean: masteryMean(m) }))
      .sort((a, b) => a.mean - b.mean)
      .slice(0, 5),
  };
}
