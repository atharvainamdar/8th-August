export type Domain = "reading" | "writing" | "math";
export type SensoryMode = "calm" | "balanced" | "bright";
export type InterestPack = "space" | "dinos" | "trains" | "animals" | "ocean";
export type ScaffoldLevel = "model" | "guided" | "independent";
export type Modality =
  | "visual"
  | "audio"
  | "avatar"
  | "video_model"
  | "manipulative"
  | "typing"
  | "speak";
export type RegulationState = "calm" | "ok" | "stressed";
export type Mood = "great" | "ok" | "hard";

export type ActivityKind =
  | "phoneme_match"
  | "blend"
  | "decode"
  | "fluency"
  | "comprehension"
  | "letter_trace"
  | "spelling_ccc"
  | "sentence_build"
  | "short_response"
  | "number_sense"
  | "ten_frame"
  | "operation"
  | "fact_fluency"
  | "word_problem"
  | "placement_probe";

export interface SkillNode {
  id: string;
  domain: Domain;
  title: string;
  description: string;
  prerequisites: string[];
  standards: string[];
  difficulty: number; // 1-10
  defaultModalities: Modality[];
  activityKinds: ActivityKind[];
}

export interface MasteryState {
  skillId: string;
  alpha: number;
  beta: number;
}

export interface LearnerState {
  childId: string;
  displayName: string;
  ageBand: string;
  sensoryMode: SensoryMode;
  interestPack: InterestPack;
  dyslexiaFont: boolean;
  soundEnabled: boolean;
  motionEnabled: boolean;
  celebrationLevel: "off" | "low" | "medium";
  sessionMinutes: number;
  mastery: Record<string, MasteryState>;
  modalityWeights: Record<Modality, number>;
  scaffoldByDomain: Record<Domain, ScaffoldLevel>;
  regulation: RegulationState;
  errorPatterns: string[];
  recentSkillIds: string[];
}

export interface SignalEvent {
  type:
    | "answer"
    | "hint"
    | "skip"
    | "rage_click"
    | "latency"
    | "mood"
    | "exit_attempt"
    | "speak_attempt"
    | "break_accepted"
    | "break_declined";
  skillId?: string;
  correct?: boolean;
  partial?: number; // 0-1
  latencyMs?: number;
  modality?: Modality;
  scaffold?: ScaffoldLevel;
  mood?: Mood;
  at: number;
}

export interface PolicyDecision {
  action:
    | "next_item"
    | "increase_scaffold"
    | "decrease_scaffold"
    | "switch_modality"
    | "offer_break"
    | "change_skill"
    | "celebrate"
    | "end_session";
  skillId: string;
  domain: Domain;
  scaffold: ScaffoldLevel;
  modality: Modality;
  activityKind: ActivityKind;
  reason: string;
  theme: InterestPack;
  offerCalmCorner?: boolean;
  shrinkDensity?: boolean;
}

export interface ActivityResult {
  skillId: string;
  activityKind: ActivityKind;
  modality: Modality;
  scaffold: ScaffoldLevel;
  correct: boolean;
  partial?: number;
  latencyMs: number;
  response?: string;
  hintsUsed: number;
  skipped?: boolean;
  metrics?: Record<string, number | string>;
}

export interface PlannedItem {
  id: string;
  skillId: string;
  domain: Domain;
  activityKind: ActivityKind;
  modality: Modality;
  scaffold: ScaffoldLevel;
  theme: InterestPack;
  prompt: string;
  data: Record<string, unknown>;
}
