export type EngineName = "local" | "openai" | "gemini" | "elevenlabs";

export type CapabilityId = "coach" | "vision" | "tts" | "stt" | "hint";

export interface CapabilityStatus {
  id: CapabilityId;
  label: string;
  engine: EngineName;
  ready: boolean;
  detail: string;
}

export interface CoachInput {
  childName: string;
  skillTitle: string;
  modality: string;
  scaffold: string;
  correct: boolean;
  interest: string;
  errorNote?: string;
}

export interface HintInput {
  childName: string;
  skillTitle: string;
  interest: string;
  scaffold: string;
  modality: string;
  lastResponse?: string;
}

export interface VisionInput {
  base64: string;
  mimeType: string;
}

export interface TTSInput {
  text: string;
  rate?: number;
}
