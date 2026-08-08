import { buildActivity } from "../curriculum/activities";
import { ensureMasteryMap, getSkill, placementProbeSkills } from "../curriculum/skills";
import { updateMastery } from "./mastery";
import { applyModalityWeight } from "./signals";
import { decideNext, defaultModalityWeights, defaultScaffolds } from "./policy";
import type {
  ActivityResult,
  Domain,
  LearnerState,
  PlannedItem,
  PolicyDecision,
  SignalEvent,
} from "./types";

export function createLearnerState(input: {
  childId: string;
  displayName: string;
  ageBand: string;
  sensoryMode: LearnerState["sensoryMode"];
  interestPack: LearnerState["interestPack"];
  dyslexiaFont?: boolean;
  soundEnabled?: boolean;
  motionEnabled?: boolean;
  celebrationLevel?: LearnerState["celebrationLevel"];
  sessionMinutes?: number;
  mastery?: LearnerState["mastery"];
}): LearnerState {
  return {
    childId: input.childId,
    displayName: input.displayName,
    ageBand: input.ageBand,
    sensoryMode: input.sensoryMode,
    interestPack: input.interestPack,
    dyslexiaFont: input.dyslexiaFont ?? false,
    soundEnabled: input.soundEnabled ?? true,
    motionEnabled: input.motionEnabled ?? true,
    celebrationLevel: input.celebrationLevel ?? "medium",
    sessionMinutes: input.sessionMinutes ?? 15,
    mastery: ensureMasteryMap(input.mastery),
    modalityWeights: defaultModalityWeights(),
    scaffoldByDomain: defaultScaffolds(),
    regulation: "ok",
    errorPatterns: [],
    recentSkillIds: [],
  };
}

export interface SessionRuntime {
  state: LearnerState;
  events: SignalEvent[];
  decision: PolicyDecision;
  item: PlannedItem;
  itemsDone: number;
  itemsPlanned: number;
  adaptations: number;
  domain: Domain | "mixed" | "placement";
  placementIds?: string[];
}

function placementDecision(
  state: LearnerState,
  skillId: string,
  action: PolicyDecision["action"] = "next_item"
): PolicyDecision {
  const skill = getSkill(skillId);
  return {
    action,
    skillId,
    domain: skill.domain,
    scaffold: state.scaffoldByDomain[skill.domain],
    modality: skill.defaultModalities[0] ?? "visual",
    activityKind: skill.activityKinds[0] ?? "placement_probe",
    reason: "Placement probe",
    theme: state.interestPack,
  };
}

export function startSession(
  state: LearnerState,
  opts: { domain?: Domain; placement?: boolean; itemsPlanned?: number } = {}
): SessionRuntime {
  if (opts.placement) {
    const probes = placementProbeSkills();
    const placementIds = probes.map((p) => p.id);
    const itemsPlanned = Math.min(8, placementIds.length);
    const decision = placementDecision(state, placementIds[0]!);
    const item = buildActivity({ ...decision, activityKind: "placement_probe" });
    return {
      state,
      events: [],
      decision,
      item,
      itemsDone: 0,
      itemsPlanned,
      adaptations: 0,
      domain: "placement",
      placementIds: placementIds.slice(0, itemsPlanned),
    };
  }

  const itemsPlanned =
    opts.itemsPlanned ??
    Math.max(4, Math.min(8, Math.round((state.sessionMinutes / 15) * 6)));
  const { state: nextState, decision } = decideNext(state, [], {
    domain: opts.domain,
    itemsDone: 0,
    itemsPlanned,
  });
  const item = buildActivity(decision);
  return {
    state: nextState,
    events: [],
    decision,
    item,
    itemsDone: 0,
    itemsPlanned,
    adaptations: 0,
    domain: opts.domain ?? "mixed",
  };
}

export function applyResult(runtime: SessionRuntime, result: ActivityResult): SessionRuntime {
  const events: SignalEvent[] = [
    ...runtime.events,
    {
      type: result.skipped ? "skip" : "answer",
      skillId: result.skillId,
      correct: result.correct,
      partial: result.partial,
      latencyMs: result.latencyMs,
      modality: result.modality,
      scaffold: result.scaffold,
      at: Date.now(),
    },
  ];
  if (result.hintsUsed > 0) {
    for (let i = 0; i < result.hintsUsed; i += 1) {
      events.push({ type: "hint", skillId: result.skillId, at: Date.now() });
    }
  }

  let state = runtime.state;
  const mastery = {
    ...state.mastery,
    [result.skillId]: updateMastery(
      state.mastery[result.skillId] ?? {
        skillId: result.skillId,
        alpha: 1,
        beta: 1,
      },
      result.correct,
      result.partial ?? 1
    ),
  };
  state = applyModalityWeight(
    {
      ...state,
      mastery,
      recentSkillIds: [...state.recentSkillIds, result.skillId].slice(-12),
    },
    result.modality,
    result.correct
  );

  if (!result.correct && result.response) {
    state = {
      ...state,
      errorPatterns: [...state.errorPatterns, `${result.skillId}:${result.response}`].slice(-20),
    };
  }

  const itemsDone = runtime.itemsDone + 1;

  if (runtime.domain === "placement" && runtime.placementIds) {
    if (itemsDone >= runtime.itemsPlanned) {
      const decision = placementDecision(state, result.skillId, "end_session");
      return {
        ...runtime,
        state,
        events,
        decision,
        itemsDone,
        adaptations: runtime.adaptations,
      };
    }
    const nextSkillId = runtime.placementIds[itemsDone]!;
    const decision = placementDecision(state, nextSkillId);
    const item = buildActivity({ ...decision, activityKind: "placement_probe" });
    return {
      ...runtime,
      state,
      events,
      decision,
      item,
      itemsDone,
    };
  }

  const domain: Domain | undefined =
    runtime.domain === "reading" || runtime.domain === "writing" || runtime.domain === "math"
      ? runtime.domain
      : undefined;
  const beforeScaffold = state.scaffoldByDomain;
  const { state: nextState, decision } = decideNext(state, events, {
    domain,
    itemsDone,
    itemsPlanned: runtime.itemsPlanned,
  });

  const adapted =
    decision.action !== "next_item" && decision.action !== "celebrate"
      ? runtime.adaptations + 1
      : runtime.adaptations;

  const scaffoldChanged =
    beforeScaffold.reading !== nextState.scaffoldByDomain.reading ||
    beforeScaffold.writing !== nextState.scaffoldByDomain.writing ||
    beforeScaffold.math !== nextState.scaffoldByDomain.math;

  const item =
    decision.action === "end_session" ? runtime.item : buildActivity(decision);

  return {
    state: nextState,
    events,
    decision,
    item,
    itemsDone,
    itemsPlanned: runtime.itemsPlanned,
    adaptations: adapted + (scaffoldChanged ? 1 : 0),
    domain: runtime.domain,
  };
}
