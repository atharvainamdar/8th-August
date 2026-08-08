import { buildActivity } from "../curriculum/activities";
import { ensureMasteryMap } from "../curriculum/skills";
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
}

export function startSession(
  state: LearnerState,
  opts: { domain?: Domain; placement?: boolean; itemsPlanned?: number } = {}
): SessionRuntime {
  const itemsPlanned =
    opts.itemsPlanned ??
    Math.max(4, Math.min(8, Math.round((state.sessionMinutes / 15) * 6)));
  const domain = opts.placement ? undefined : opts.domain;
  const { state: nextState, decision } = decideNext(state, [], {
    domain,
    itemsDone: 0,
    itemsPlanned,
  });
  const item = buildActivity(
    opts.placement ? { ...decision, activityKind: "placement_probe" } : decision
  );
  return {
    state: nextState,
    events: [],
    decision,
    item,
    itemsDone: 0,
    itemsPlanned,
    adaptations: 0,
    domain: opts.placement ? "placement" : opts.domain ?? "mixed",
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

  // Track simple error patterns
  if (!result.correct && result.response) {
    state = {
      ...state,
      errorPatterns: [...state.errorPatterns, `${result.skillId}:${result.response}`].slice(-20),
    };
  }

  const itemsDone = runtime.itemsDone + 1;
  const domain =
    runtime.domain === "mixed" || runtime.domain === "placement"
      ? undefined
      : runtime.domain;

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

  // Detect scaffold/modality change as adaptation even on next_item after stress recovery
  const scaffoldChanged =
    beforeScaffold.reading !== nextState.scaffoldByDomain.reading ||
    beforeScaffold.writing !== nextState.scaffoldByDomain.writing ||
    beforeScaffold.math !== nextState.scaffoldByDomain.math;

  const item =
    decision.action === "end_session"
      ? runtime.item
      : buildActivity(
          runtime.domain === "placement"
            ? { ...decision, activityKind: "placement_probe" }
            : decision
        );

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
