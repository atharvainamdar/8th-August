import { beforeEach, describe, expect, it } from "vitest";
import { listCapabilities, pickCloudLLM, preferredProvider } from "@/lib/ai/capabilities";
import { localCoach, localHint } from "@/lib/ai/providers/local";

describe("AI capabilities", () => {
  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    delete process.env.AI_PREFERRED_PROVIDER;
  });

  it("defaults to local LLM with no keys", () => {
    expect(pickCloudLLM()).toBe("local");
    expect(preferredProvider()).toBe("auto");
  });

  it("lists all capabilities as ready offline", () => {
    const caps = listCapabilities();
    expect(caps.length).toBeGreaterThanOrEqual(5);
    expect(caps.every((c) => c.ready)).toBe(true);
    expect(caps.find((c) => c.id === "coach")?.engine).toBe("local");
    expect(caps.find((c) => c.id === "tts")?.engine).toBe("local");
  });

  it("picks openai when key present", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    expect(pickCloudLLM()).toBe("openai");
    expect(listCapabilities().find((c) => c.id === "coach")?.engine).toBe("openai");
  });

  it("respects preferred gemini when both keys exist", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "gem-test";
    process.env.AI_PREFERRED_PROVIDER = "gemini";
    expect(pickCloudLLM()).toBe("gemini");
  });

  it("marks elevenlabs tts when key present", () => {
    process.env.ELEVENLABS_API_KEY = "el-test";
    expect(listCapabilities().find((c) => c.id === "tts")?.engine).toBe("elevenlabs");
  });
});

describe("local coach bank", () => {
  it("returns interest-themed coaching", () => {
    const line = localCoach({
      childName: "Ava",
      skillTitle: "short vowels",
      modality: "audio",
      scaffold: "guided",
      correct: true,
      interest: "trains",
    });
    expect(line).toContain("Ava");
    expect(line.length).toBeGreaterThan(20);
  });

  it("returns scaffold-aware hints", () => {
    const hint = localHint({
      childName: "Ava",
      skillTitle: "blending",
      interest: "space",
      scaffold: "model",
      modality: "visual",
    });
    expect(hint.toLowerCase()).toMatch(/watch|step|help|try/);
  });
});
