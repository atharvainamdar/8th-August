import { getSkill, getSkillsByDomain, prerequisitesMet } from "../curriculum/skills";
import { isMastered, masteryMean, needsReview } from "./mastery";
import { deriveRegulation, summarizeSignals } from "./signals";
import type {
  ActivityKind,
  Domain,
  LearnerState,
  Modality,
  PolicyDecision,
  ScaffoldLevel,
  SignalEvent,
  SkillNode,
} from "./types";

const SCAFFOLD_ORDER: ScaffoldLevel[] = ["independent", "guided", "model"];

function bumpScaffold(current: ScaffoldLevel, dir: 1 | -1): ScaffoldLevel {
  const idx = SCAFFOLD_ORDER.indexOf(current);
  const next = Math.min(SCAFFOLD_ORDER.length - 1, Math.max(0, idx + dir));
  return SCAFFOLD_ORDER[next];
}

function pickModality(state: LearnerState, skill: SkillNode, avoid?: Modality): Modality {
  const candidates = skill.defaultModalities.filter((m) => m !== avoid);
  const pool = candidates.length ? candidates : skill.defaultModalities;
  let best = pool[0];
  let bestScore = -Infinity;
  for (const m of pool) {
    const score = state.modalityWeights[m] ?? 1;
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  // Under stress, prefer lower-demand modalities
  if (state.regulation === "stressed") {
    if (pool.includes("audio")) return "audio";
    if (pool.includes("visual")) return "visual";
  }
  return best;
}

function pickActivityKind(skill: SkillNode, scaffold: ScaffoldLevel): ActivityKind {
  if (scaffold === "model" && skill.activityKinds.includes("video_model" as ActivityKind)) {
    return skill.activityKinds[0];
  }
  return skill.activityKinds[0];
}

function chooseSkill(state: LearnerState, domain: Domain): SkillNode {
  const skills = getSkillsByDomain(domain);
  const unlocked = skills.filter((s) => prerequisitesMet(s.id, state.mastery));

  // Prefer review of shaky unlocked skills, else lowest mastery unlocked, else easiest
  const review = unlocked
    .filter((s) => {
      const m = state.mastery[s.id];
      return m ? needsReview(m) && !isMastered(m) : true;
    })
    .sort((a, b) => {
      const ma = state.mastery[a.id] ? masteryMean(state.mastery[a.id]) : 0;
      const mb = state.mastery[b.id] ? masteryMean(state.mastery[b.id]) : 0;
      return ma - mb;
    });

  if (review.length) {
    // Avoid repeating same skill too often
    const notRecent = review.filter((s) => !state.recentSkillIds.slice(-2).includes(s.id));
    return (notRecent[0] ?? review[0])!;
  }

  const nextNew = unlocked
    .filter((s) => !state.mastery[s.id] || !isMastered(state.mastery[s.id]))
    .sort((a, b) => a.difficulty - b.difficulty);

  return nextNew[0] ?? unlocked[0] ?? skills[0]!;
}

export function decideNext(
  state: LearnerState,
  events: SignalEvent[],
  opts: { domain?: Domain; forceSkillId?: string; itemsDone?: number; itemsPlanned?: number } = {}
): { state: LearnerState; decision: PolicyDecision } {
  const summary = summarizeSignals(events);
  let nextState: LearnerState = {
    ...state,
    regulation: deriveRegulation(state, summary),
  };

  const domain =
    opts.domain ??
    (opts.forceSkillId ? getSkill(opts.forceSkillId).domain : pickDomain(nextState));

  if (opts.itemsPlanned && opts.itemsDone !== undefined && opts.itemsDone >= opts.itemsPlanned) {
    const skill = chooseSkill(nextState, domain);
    return {
      state: nextState,
      decision: {
        action: "end_session",
        skillId: skill.id,
        domain,
        scaffold: nextState.scaffoldByDomain[domain],
        modality: pickModality(nextState, skill),
        activityKind: pickActivityKind(skill, nextState.scaffoldByDomain[domain]),
        reason: "Session plan complete",
        theme: nextState.interestPack,
      },
    };
  }

  // Offer break / calm corner when stressed — once per struggle streak
  const recentlyOfferedBreak = events
    .slice(-6)
    .some((e) => e.type === "break_accepted" || e.type === "break_declined");
  if (summary.stressed && summary.consecutiveWrong >= 2 && !recentlyOfferedBreak) {
    const skill = opts.forceSkillId ? getSkill(opts.forceSkillId) : chooseSkill(nextState, domain);
    const scaffold = bumpScaffold(nextState.scaffoldByDomain[domain], 1);
    nextState = {
      ...nextState,
      scaffoldByDomain: { ...nextState.scaffoldByDomain, [domain]: scaffold },
      regulation: "stressed",
    };
    const currentModality = pickModality(nextState, skill);
    const switched = pickModality(nextState, skill, currentModality);
    return {
      state: nextState,
      decision: {
        action: "offer_break",
        skillId: skill.id,
        domain,
        scaffold,
        modality: switched,
        activityKind: pickActivityKind(skill, scaffold),
        reason: "Struggle signals: consecutive errors / stress — offer calm + increase scaffold + switch modality",
        theme: nextState.interestPack,
        offerCalmCorner: true,
        shrinkDensity: true,
      },
    };
  }

  // Two wrongs => increase scaffold and/or switch modality
  if (summary.consecutiveWrong >= 2) {
    const skill = opts.forceSkillId ? getSkill(opts.forceSkillId) : chooseSkill(nextState, domain);
    const scaffold = bumpScaffold(nextState.scaffoldByDomain[domain], 1);
    const avoid = events.filter((e) => e.type === "answer").slice(-1)[0]?.modality;
    const modality = pickModality(nextState, skill, avoid);
    nextState = {
      ...nextState,
      scaffoldByDomain: { ...nextState.scaffoldByDomain, [domain]: scaffold },
    };
    return {
      state: nextState,
      decision: {
        action: avoid && modality !== avoid ? "switch_modality" : "increase_scaffold",
        skillId: skill.id,
        domain,
        scaffold,
        modality,
        activityKind: pickActivityKind(skill, scaffold),
        reason: "Two consecutive wrongs — increase support",
        theme: nextState.interestPack,
        shrinkDensity: true,
      },
    };
  }

  // Three independents correct => decrease scaffold / advance
  if (summary.consecutiveCorrect >= 3) {
    const skill = opts.forceSkillId ? getSkill(opts.forceSkillId) : chooseSkill(nextState, domain);
    const scaffold = bumpScaffold(nextState.scaffoldByDomain[domain], -1);
    nextState = {
      ...nextState,
      scaffoldByDomain: { ...nextState.scaffoldByDomain, [domain]: scaffold },
    };
    // If mastered, change skill
    const m = nextState.mastery[skill.id];
    if (m && isMastered(m) && scaffold === "independent") {
      const nextSkill = chooseSkill(
        {
          ...nextState,
          recentSkillIds: [...nextState.recentSkillIds, skill.id],
        },
        domain
      );
      return {
        state: nextState,
        decision: {
          action: "change_skill",
          skillId: nextSkill.id,
          domain,
          scaffold: nextState.scaffoldByDomain[domain],
          modality: pickModality(nextState, nextSkill),
          activityKind: pickActivityKind(nextSkill, nextState.scaffoldByDomain[domain]),
          reason: "Mastery reached — advance skill",
          theme: nextState.interestPack,
        },
      };
    }
    return {
      state: nextState,
      decision: {
        action: "decrease_scaffold",
        skillId: skill.id,
        domain,
        scaffold,
        modality: pickModality(nextState, skill),
        activityKind: pickActivityKind(skill, scaffold),
        reason: "Three successes — fade scaffold",
        theme: nextState.interestPack,
      },
    };
  }

  const skill = opts.forceSkillId ? getSkill(opts.forceSkillId) : chooseSkill(nextState, domain);
  const scaffold = nextState.scaffoldByDomain[domain];
  const modality = pickModality(nextState, skill);
  return {
    state: nextState,
    decision: {
      action: "next_item",
      skillId: skill.id,
      domain,
      scaffold,
      modality,
      activityKind: pickActivityKind(skill, scaffold),
      reason: "Continue practice",
      theme: nextState.interestPack,
    },
  };
}

function pickDomain(state: LearnerState): Domain {
  const domains: Domain[] = ["reading", "writing", "math"];
  let weakest: Domain = "reading";
  let lowest = Infinity;
  for (const d of domains) {
    const skills = getSkillsByDomain(d);
    const means = skills.map((s) =>
      state.mastery[s.id] ? masteryMean(state.mastery[s.id]) : 0.3
    );
    const avg = means.reduce((a, b) => a + b, 0) / Math.max(1, means.length);
    if (avg < lowest) {
      lowest = avg;
      weakest = d;
    }
  }
  return weakest;
}

export function defaultModalityWeights(): Record<Modality, number> {
  return {
    visual: 1,
    audio: 1,
    avatar: 1,
    video_model: 1,
    manipulative: 1,
    typing: 1,
    speak: 1,
  };
}

export function defaultScaffolds(): Record<Domain, ScaffoldLevel> {
  return {
    reading: "guided",
    writing: "guided",
    math: "guided",
  };
}
